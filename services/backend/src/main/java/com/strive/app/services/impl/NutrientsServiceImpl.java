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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NutrientsServiceImpl implements NutrientsService {

    private static final int HISTORY_DAYS = 28;
    private static final int MAX_CALORIE_CHANGE_PER_RUN = 150;

    private static final int MIN_WEIGHT_POINTS_FOR_INFERENCE = 14;
    private static final int MIN_CALORIE_DAYS_FOR_INFERENCE = 7;
    private static final int DEFAULT_INCOMPLETE_LOG_THRESHOLD = 800;

    // Common minimum daily intake without medical supervision
    private static final int MIN_CALORIES_FEMALE = 1200;
    private static final int MIN_CALORIES_MALE = 1500;

    private final BodyMetricsRepository bodyMetricsRepository;
    private final MetricsRepository metricsRepository;
    private final MetricsService metricsService;
    private final NutrientGoalsMapper nutrientGoalsMapper;

    @Override
    public void recalculate(UserEntity user) {
        Map<LocalDate, Double> weights = recentWeights(user);
        if (weights.isEmpty() && user.getWeight() != null) {
            weights = Map.of(LocalDate.now(), user.getWeight().doubleValue());
        }
        apply(user, calculateFor(user, weights));
    }

    @Override
    public boolean recalculateScheduled(UserEntity user) {
        if (!hasCompleteProfile(user)) return false;

        Map<LocalDate, Double> weights = recentWeights(user);
        if (!hasSufficientWeightData(weights.keySet())) return false;

        NutrientGoalsDto goals = calculateFor(user, weights);
        int limitedCalories = limitCalorieChange(user.getGoalCalories(), goals.getGoalCalories());
        if (limitedCalories != goals.getGoalCalories()) {
            // Rebuild macros around the limited calorie goal so they still add up to it
            goals = buildGoalsForCalories(limitedCalories, goals.getGoalProtein(), user.getSexType(), user.getAge());
        }
        apply(user, goals);
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

    private Map<LocalDate, Double> recentWeights(UserEntity user) {
        return bodyMetricsRepository
                .findAllByUserIdAndDateRange(user.getId(), windowStart(), windowEnd())
                .stream()
                .filter(log -> log.getWeight() != null)
                .collect(Collectors.toMap(log -> log.getId().getDate(), BodyMetricsLogEntity::getWeight));
    }

    private Map<LocalDate, Integer> recentCalories(UserEntity user) {
        return metricsRepository
                .findAllByUserIdAndDateRange(user.getId(), windowStart(), windowEnd())
                .stream()
                .filter(day -> day.getCurrentCalories() != null && day.getCurrentCalories() > 0)
                .collect(Collectors.toMap(day -> day.getId().getDate(), MetricsEntity::getCurrentCalories));
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

    private void apply(UserEntity user, NutrientGoalsDto goals) {
        nutrientGoalsMapper.updateUserWithGoals(goals, user);
        user.setGoalsUpdatedAt(LocalDate.now());
        metricsService.updateTodaysGoals(user.getId(), goals);
    }

    /**
     * Checks that at least 3 of the 4 weeks in the window have 4 or more days of weight data.
     */
    private static boolean hasSufficientWeightData(Collection<LocalDate> weighInDates) {
        LocalDate start = windowStart();
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

    private static int limitCalorieChange(Integer currentGoal, int newGoal) {
        if (currentGoal == null) return newGoal;
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

        // Use the most recent 14 days as the weight baseline for protein/macro calculations
        LocalDate latestDate = weightHistory.keySet().stream().max(LocalDate::compareTo).orElse(LocalDate.now());
        LocalDate cutoff = latestDate.minusDays(14);
        double avgRecentWeight = weightHistory.entrySet().stream()
                .filter(e -> !e.getKey().isBefore(cutoff))
                .mapToDouble(Map.Entry::getValue)
                .average()
                .orElseGet(() -> weightHistory.values().stream().mapToDouble(Double::doubleValue).average().orElse(0));

        double weightKg = weightType == WeightType.LBS ? avgRecentWeight / 2.205 : avgRecentWeight;

        // Fit a straight line through every weigh-in to get the weekly trend. Using each day
        // (rather than weekly averages) keeps a single weigh-in, like one that lands alone in a
        // partial last week, from pulling the trend much harder than the others.
        double actualWeeklyChange = 0;
        boolean hasTrend = false;
        if (weightHistory.size() >= 2) {
            LocalDate firstDate = Collections.min(weightHistory.keySet());
            int n = weightHistory.size();
            double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, spanWeeks = 0;
            for (Map.Entry<LocalDate, Double> entry : weightHistory.entrySet()) {
                double x = ChronoUnit.DAYS.between(firstDate, entry.getKey()) / 7.0; // weeks since first weigh-in
                double y = entry.getValue();
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumXX += x * x;
                spanWeeks = Math.max(spanWeeks, x);
            }
            double denom = n * sumXX - sumX * sumX;
            // Need at least a week between the first and last weigh-in for a meaningful trend
            if (spanWeeks >= 1 && denom != 0) {
                actualWeeklyChange = (n * sumXY - sumX * sumY) / denom; // weight units per week
                hasTrend = true;
            }
        }

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

        int proteinGrams = (int) Math.round(weightKg * 2);
        return buildGoalsForCalories((int) Math.round(goalCalories), proteinGrams, sex, age);
    }

    /**
     * Builds macro and micronutrient goals around a calorie goal. The calorie goal is raised
     * to a safe minimum if needed, so the returned goalCalories can be higher than requested.
     */
    static NutrientGoalsDto buildGoalsForCalories(int goalCalories, int proteinGrams, GenderType sex, Integer age) {
        int minCalories = (sex == GenderType.MALE) ? MIN_CALORIES_MALE : MIN_CALORIES_FEMALE;
        int calories = Math.max(goalCalories, minCalories);

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
