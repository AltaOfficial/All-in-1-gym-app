package com.strive.app.services.impl;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.enums.TrainingExperience;
import com.strive.app.enums.WeightType;
import com.strive.app.services.NutrientsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class NutrientsServiceImpl implements NutrientsService {

    private static final int MIN_WEIGHT_POINTS_FOR_INFERENCE = 14;
    private static final int MIN_CALORIE_DAYS_FOR_INFERENCE = 7;

    @Override
    public NutrientGoalsDto calculateNutrientGoals(
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

        // Compute linear regression slope over all weight history (lbs/week)
        double actualWeeklyChange = 0;
        boolean hasTrend = false;
        if (weightHistory.size() >= 2) {
            List<LocalDate> sortedDates = new ArrayList<>(weightHistory.keySet());
            Collections.sort(sortedDates);
            LocalDate firstDate = sortedDates.get(0);

            int n = sortedDates.size();
            double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            for (LocalDate date : sortedDates) {
                double x = ChronoUnit.DAYS.between(firstDate, date);
                double y = weightHistory.get(date);
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumXX += x * x;
            }
            double denom = n * sumXX - sumX * sumX;
            if (denom != 0) {
                actualWeeklyChange = ((n * sumXY - sumX * sumY) / denom) * 7;
                hasTrend = true;
            }
        }

        // Count days with actual calorie entries
        long loggedCalorieDays = caloriesHistory.values().stream().filter(c -> c != null && c > 0).count();

        double goalCalories;

        if (weightHistory.size() >= MIN_WEIGHT_POINTS_FOR_INFERENCE
                && loggedCalorieDays >= MIN_CALORIE_DAYS_FOR_INFERENCE
                && hasTrend) {
            // Infer TDEE from actual intake and actual weight trend — no activity factor needed
            double avgDailyCalories = caloriesHistory.values().stream()
                    .filter(c -> c != null && c > 0)
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
                trendCorrection = Math.max(-500, Math.min(500, trendCorrection));
                goalCalories += trendCorrection;
            }
        }

        // --- Macronutrients ---
        int proteinGrams = (int) Math.round(weightKg * 2);
        int proteinCalories = proteinGrams * 4;

        int fatCalories = (int) (goalCalories * 0.25);
        int fatGrams = fatCalories / 9;

        int carbCalories = (int) goalCalories - (proteinCalories + fatCalories);
        int carbGrams = carbCalories / 4;

        // --- Micronutrients ---
        int fiber = (sex == GenderType.FEMALE) ? 26 : 34;
        int sugar = (int) Math.round((goalCalories * 0.10) / 4.0);
        int satFat = (int) Math.round((goalCalories * 0.10) / 9.0);
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
            fiber = (int) Math.round(goalCalories * 14.0 / 1000.0);
        } else if (age >= 50) {
            fiber = (sex == GenderType.FEMALE) ? 22 : 28;
        }

        return NutrientGoalsDto.builder()
                .goalCalories((int) Math.round(goalCalories))
                .goalProtein(proteinGrams)
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
