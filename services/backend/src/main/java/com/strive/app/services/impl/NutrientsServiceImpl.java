package com.strive.app.services.impl;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.domain.entities.BodyMetricsLogEntity;
import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.enums.TrainingExperience;
import com.strive.app.enums.WeightType;
import com.strive.app.mappers.NutrientGoalsMapper;
import com.strive.app.repositories.BodyMetricsRepository;
import com.strive.app.repositories.MetricsRepository;
import com.strive.app.services.MetricsService;
import com.strive.app.services.NutrientsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.OptionalDouble;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NutrientsServiceImpl implements NutrientsService {

    // 8 weeks, so normal 1-2 lb water swings can't pass for a real weight trend
    private static final int HISTORY_DAYS = 56;
    private static final int MAX_CALORIE_CHANGE_PER_RUN = 150;

    private static final int MIN_WEIGHT_POINTS_FOR_INFERENCE = 14;
    private static final int MIN_CALORIE_DAYS_FOR_INFERENCE = 7;
    private static final int DEFAULT_INCOMPLETE_LOG_THRESHOLD = 800;

    // Body-fat scale readings are noisy, so only trust a fat trend with plenty of readings
    private static final int MIN_BODY_FAT_READINGS = 14;
    private static final double MIN_BODY_FAT_SPAN_WEEKS = 4;
    // Fat gain slower than this share of body weight per week (about 0.3 lb a month at
    // 140 lb) is within scale noise, so it doesn't count as rising
    private static final double MIN_FAT_GAIN_PER_WEEK = 0.0005;

    private static final double PROTEIN_GRAMS_PER_KG = 2.0;

    private final BodyMetricsRepository bodyMetricsRepository;
    private final MetricsRepository metricsRepository;
    private final MetricsService metricsService;
    private final NutrientGoalsMapper nutrientGoalsMapper;

    @Override
    public void recalculate(UserEntity user, boolean limitCalorieChange) {
        List<BodyMetricsLogEntity> bodyMetrics = recentBodyMetrics(user);
        Map<LocalDate, Double> weights = weightsFrom(bodyMetrics);
        if (weights.isEmpty() && user.getWeight() != null) {
            weights = Map.of(LocalDate.now(), user.getWeight().doubleValue());
        }
        apply(user, user.getCustomCalorieGoal() != null
                ? goalsForCustomCalories(user, weights)
                : automaticGoals(user, weights, bodyFatFrom(bodyMetrics), limitCalorieChange));
    }

    @Override
    public boolean recalculateScheduled(UserEntity user) {
        if (!hasCompleteProfile(user)) return false;

        List<BodyMetricsLogEntity> bodyMetrics = recentBodyMetrics(user);
        Map<LocalDate, Double> weights = weightsFrom(bodyMetrics);
        if (!hasSufficientWeightData(weights.keySet())) return false;

        // A calorie goal the user set stays put; only the macros follow their weight
        apply(user, user.getCustomCalorieGoal() != null
                ? goalsForCustomCalories(user, weights)
                : automaticGoals(user, weights, bodyFatFrom(bodyMetrics), true));
        return true;
    }

    // --- Loading the user's history ---

    // The window ends yesterday: today's food log is still in progress, and a single
    // weigh-in at the very end of the window has too much pull on the trend.
    private static LocalDate windowEnd() {
        return LocalDate.now().minusDays(1);
    }

    private static LocalDate windowStart() {
        return windowEnd().minusDays(HISTORY_DAYS - 1);
    }

    private List<BodyMetricsLogEntity> recentBodyMetrics(UserEntity user) {
        return bodyMetricsRepository.findAllByUserIdAndDateRange(user.getId(), windowStart(), windowEnd());
    }

    private static Map<LocalDate, Double> weightsFrom(List<BodyMetricsLogEntity> bodyMetrics) {
        return bodyMetrics.stream()
                .filter(log -> log.getWeight() != null)
                .collect(Collectors.toMap(log -> log.getId().getDate(), BodyMetricsLogEntity::getWeight));
    }

    private static Map<LocalDate, Double> bodyFatFrom(List<BodyMetricsLogEntity> bodyMetrics) {
        return bodyMetrics.stream()
                .filter(log -> log.getBodyFat() != null && log.getBodyFat() > 0)
                .collect(Collectors.toMap(log -> log.getId().getDate(), BodyMetricsLogEntity::getBodyFat));
    }

    private Map<LocalDate, Integer> recentCalories(UserEntity user) {
        return metricsRepository
                .findAllByUserIdAndDateRange(user.getId(), windowStart(), windowEnd())
                .stream()
                .filter(day -> day.getCurrentCalories() != null && day.getCurrentCalories() > 0)
                .collect(Collectors.toMap(day -> day.getId().getDate(), MetricsEntity::getCurrentCalories));
    }

    // --- Turning history into goals ---

    private NutrientGoalsDto automaticGoals(UserEntity user, Map<LocalDate, Double> weights,
                                            Map<LocalDate, Double> bodyFat, boolean limitChange) {
        NutrientGoalsDto goals = calculateFor(user, weights);
        Integer currentGoal = user.getGoalCalories();
        if (currentGoal == null) return goals;

        int calories = goals.getGoalCalories();
        // On a bulk, fat mass going up means there's already a surplus, so eating more would
        // mostly add fat. Hold calories instead of raising them.
        if (user.getMainGoal() == MainGoal.BUILD_MUSCLE
                && calories > currentGoal
                && fatMassRising(weights, bodyFat)) {
            calories = currentGoal;
        }
        if (limitChange) {
            calories = limitCalorieChange(currentGoal, calories);
        }
        if (calories == goals.getGoalCalories()) return goals;

        // Rebuild macros around the adjusted calorie goal so they still add up to it
        return buildGoalsForCalories(
                calories, proteinGrams(weights, user.getWeightType()), user.getSexType(), user.getAge());
    }

    private NutrientGoalsDto calculateFor(UserEntity user, Map<LocalDate, Double> weights) {
        return calculateNutrientGoals(
                user.getGoalCalories(),
                user.getAge(),
                weights,
                recentCalories(user),
                user.getWeightType(),
                user.getSexType(),
                user.getHeightInInches(),
                user.getWeightChangeAmount(),
                user.getMainGoal(),
                user.getTrainingExperience());
    }

    private static NutrientGoalsDto goalsForCustomCalories(UserEntity user, Map<LocalDate, Double> weights) {
        return buildGoalsForCalories(
                user.getCustomCalorieGoal(), proteinGrams(weights, user.getWeightType()),
                user.getSexType(), user.getAge());
    }

    private void apply(UserEntity user, NutrientGoalsDto goals) {
        nutrientGoalsMapper.updateUserWithGoals(goals, user);
        user.setGoalsUpdatedAt(LocalDate.now());
        metricsService.updateTodaysGoals(user.getId(), goals);
    }

    /**
     * Checks that at least 3 of the last 4 weeks have 4 or more days of weight data, so the
     * scheduler only moves goals for people who are still weighing in.
     */
    private static boolean hasSufficientWeightData(Collection<LocalDate> weighInDates) {
        LocalDate start = windowEnd().minusDays(27);
        int weeksPassing = 0;
        for (int week = 0; week < 4; week++) {
            LocalDate weekStart = start.plusDays((long) week * 7);
            LocalDate weekEnd = weekStart.plusDays(6);
            long daysWithData = weighInDates.stream()
                    .filter(date -> !date.isBefore(weekStart) && !date.isAfter(weekEnd))
                    .count();
            if (daysWithData >= 4) weeksPassing++;
        }
        return weeksPassing >= 3;
    }

    private static int limitCalorieChange(int currentGoal, int newGoal) {
        int change = Math.clamp(newGoal - currentGoal, -MAX_CALORIE_CHANGE_PER_RUN, MAX_CALORIE_CHANGE_PER_RUN);
        return currentGoal + change;
    }

    private static boolean hasCompleteProfile(UserEntity user) {
        return user.getAge() != null
                && user.getWeightType() != null
                && user.getSexType() != null
                && user.getHeightInInches() != null
                && user.getMainGoal() != null
                && user.getTrainingExperience() != null;
    }

    // --- The math. Static and database-free, so it can be tested directly. ---

    static NutrientGoalsDto calculateNutrientGoals(
            Integer currentCalorieGoal,
            Integer age,
            Map<LocalDate, Double> weightHistory,
            Map<LocalDate, Integer> caloriesHistory,
            WeightType weightType,
            GenderType sex,
            Integer heightInInches,
            Double weightChangeAmount,
            MainGoal mainGoal,
            TrainingExperience trainingExperience) {

        double caloriesPerUnit = (weightType == WeightType.LBS) ? 3500.0 : 7700.0;
        double dailyAdjustment = (weightChangeAmount != null)
                ? (weightChangeAmount * caloriesPerUnit / 7.0)
                : 0.0;

        double weightKg = recentWeightKg(weightHistory, weightType);

        // Fit a straight line through every weigh-in to get the weekly trend. Using each day
        // (rather than weekly averages) keeps a single weigh-in, like one that lands alone in a
        // partial last week, from pulling the trend much harder than the others. It needs at
        // least a week between the first and last weigh-in to mean anything.
        OptionalDouble trend = weeklyTrend(weightHistory, 1);
        boolean hasTrend = trend.isPresent();
        double actualWeeklyChange = trend.orElse(0); // weight units per week

        // Days under half the current goal are probably incomplete logs, so leave them out.
        // There's no current goal yet during onboarding, so use a fixed cutoff then.
        int incompleteLogThreshold = (currentCalorieGoal != null)
                ? currentCalorieGoal / 2
                : DEFAULT_INCOMPLETE_LOG_THRESHOLD;
        List<Integer> completeCalorieDays = caloriesHistory.values().stream()
                .filter(calories -> calories != null && calories > incompleteLogThreshold)
                .toList();

        double goalCalories;

        if (weightHistory.size() >= MIN_WEIGHT_POINTS_FOR_INFERENCE
                && completeCalorieDays.size() >= MIN_CALORIE_DAYS_FOR_INFERENCE
                && hasTrend) {
            // Infer TDEE from actual intake and actual weight trend — no activity factor needed
            double avgDailyCalories = completeCalorieDays.stream()
                    .mapToInt(Integer::intValue)
                    .average()
                    .orElse(0);

            double inferredTDEE = avgDailyCalories - (actualWeeklyChange * caloriesPerUnit / 7.0);

            goalCalories = switch (mainGoal) {
                case LOSE_FAT -> inferredTDEE - dailyAdjustment;
                case BUILD_MUSCLE -> inferredTDEE + dailyAdjustment;
                case MAINTAIN -> inferredTDEE;
            };
        } else {
            // Fallback: estimate TDEE from BMR × activity factor (used during onboarding / insufficient data)
            double bmr = 10 * weightKg + 6.25 * (heightInInches * 2.54) - 5 * age;
            bmr += (sex == GenderType.MALE) ? 5 : -161;

            double activityFactor = switch (trainingExperience) {
                case BEGINNER -> 1.375;
                case INTERMEDIATE -> 1.55;
                default -> 1.2;
            };

            double tdee = bmr * activityFactor;

            goalCalories = switch (mainGoal) {
                case LOSE_FAT -> tdee - dailyAdjustment;
                case BUILD_MUSCLE -> tdee + dailyAdjustment;
                case MAINTAIN -> tdee;
            };

            // Apply trend correction when weight history exists but calorie history is insufficient
            if (hasTrend) {
                double targetWeeklyChange = switch (mainGoal) {
                    case BUILD_MUSCLE -> weightChangeAmount != null ? weightChangeAmount : 0;
                    case LOSE_FAT -> weightChangeAmount != null ? -weightChangeAmount : 0;
                    case MAINTAIN -> 0;
                };
                double trendCorrection = ((targetWeeklyChange - actualWeeklyChange) * caloriesPerUnit) / 7.0;
                trendCorrection = Math.clamp(trendCorrection, -500, 500);
                goalCalories += trendCorrection;
            }
        }

        return buildGoalsForCalories((int) Math.round(goalCalories), proteinGrams(weightHistory, weightType), sex, age);
    }

    /**
     * Slope of a least-squares line through the points, in units per week. Empty when the
     * points span less than minSpanWeeks.
     */
    static OptionalDouble weeklyTrend(Map<LocalDate, Double> points, double minSpanWeeks) {
        if (points.size() < 2) return OptionalDouble.empty();

        LocalDate firstDate = Collections.min(points.keySet());
        int n = points.size();
        double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, spanWeeks = 0;
        for (Map.Entry<LocalDate, Double> entry : points.entrySet()) {
            double x = ChronoUnit.DAYS.between(firstDate, entry.getKey()) / 7.0; // weeks since the first point
            double y = entry.getValue();
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
            spanWeeks = Math.max(spanWeeks, x);
        }
        double denom = n * sumXX - sumX * sumX;
        if (spanWeeks < minSpanWeeks || denom == 0) return OptionalDouble.empty();
        return OptionalDouble.of((n * sumXY - sumX * sumY) / denom);
    }

    /**
     * Whether fat mass (weight × body-fat %) is trending up, using days with both readings.
     * False when there aren't enough readings to tell.
     */
    static boolean fatMassRising(Map<LocalDate, Double> weights, Map<LocalDate, Double> bodyFatPercent) {
        Map<LocalDate, Double> fatMass = new HashMap<>();
        bodyFatPercent.forEach((date, percent) -> {
            Double weight = weights.get(date);
            if (weight != null) fatMass.put(date, weight * percent / 100);
        });
        if (fatMass.size() < MIN_BODY_FAT_READINGS) return false;

        double averageWeight = fatMass.keySet().stream().mapToDouble(weights::get).average().orElse(0);
        return weeklyTrend(fatMass, MIN_BODY_FAT_SPAN_WEEKS).orElse(0) > averageWeight * MIN_FAT_GAIN_PER_WEEK;
    }

    private static int proteinGrams(Map<LocalDate, Double> weightHistory, WeightType weightType) {
        return (int) Math.round(recentWeightKg(weightHistory, weightType) * PROTEIN_GRAMS_PER_KG);
    }

    /** Average of the last 14 days of weigh-ins, in kg. The baseline for protein and the BMR formula. */
    private static double recentWeightKg(Map<LocalDate, Double> weightHistory, WeightType weightType) {
        LocalDate latestDate = weightHistory.keySet().stream().max(LocalDate::compareTo).orElse(LocalDate.now());
        LocalDate cutoff = latestDate.minusDays(14);
        double avgRecentWeight = weightHistory.entrySet().stream()
                .filter(e -> !e.getKey().isBefore(cutoff))
                .mapToDouble(Map.Entry::getValue)
                .average()
                .orElseGet(() -> weightHistory.values().stream().mapToDouble(Double::doubleValue).average().orElse(0));

        return weightType == WeightType.LBS ? avgRecentWeight / 2.205 : avgRecentWeight;
    }

    /**
     * Builds macro and micronutrient goals around a calorie goal. The calorie goal is raised
     * to a safe minimum if needed, so the returned goalCalories can be higher than requested.
     */
    static NutrientGoalsDto buildGoalsForCalories(int goalCalories, int proteinGrams, GenderType sex, Integer age) {
        int calories = Math.max(goalCalories, NutrientsService.minimumCalories(sex));

        // --- Macronutrients ---
        int fatCalories = (int) (calories * 0.25);
        int fatGrams = fatCalories / 9;

        // Protein is weight-based, so on a low calorie goal it can use up the whole budget.
        // Cap it so carbs never go negative and the macros still fit the calorie goal.
        int protein = Math.min(proteinGrams, (calories - fatCalories) / 4);
        int proteinCalories = protein * 4;

        int carbCalories = calories - (proteinCalories + fatCalories);
        int carbGrams = carbCalories / 4;

        // --- Micronutrients ---
        int fiber = (sex == GenderType.FEMALE) ? 26 : 34;
        int sugar = (int) Math.round((calories * 0.10) / 4.0);
        int satFat = (int) Math.round((calories * 0.10) / 9.0);
        int cholesterol = 300;
        int sodium = 2300;
        int potassium = (sex == GenderType.FEMALE) ? 2600 : 3400;

        if (age < 9) {
            potassium = 2300;
        } else if (age <= 13) {
            potassium = (sex == GenderType.FEMALE) ? 2300 : 2500;
        } else if (age <= 18) {
            potassium = (sex == GenderType.FEMALE) ? 2300 : 3000;
        }

        if (age < 18) {
            fiber = (int) Math.round(calories * 14.0 / 1000.0);
        } else if (age >= 50) {
            fiber = (sex == GenderType.FEMALE) ? 22 : 28;
        }

        return NutrientGoalsDto.builder()
                .goalCalories(calories)
                .goalProtein(protein)
                .goalFat(fatGrams)
                .goalCarbohydrates(carbGrams)
                .goalFiber(fiber)
                .goalSugar(sugar)
                .goalSaturatedFat(satFat)
                .goalCholesterol(cholesterol)
                .goalSodium(sodium)
                .goalPotassium(potassium)
                .build();
    }
}
