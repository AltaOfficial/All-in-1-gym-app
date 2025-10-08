package com.strive.app.services.impl;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.enums.TrainingExperience;
import com.strive.app.enums.WeightType;
import com.strive.app.services.NutrientsService;
import org.springframework.stereotype.Service;

@Service
public class NutrientsServiceImpl implements NutrientsService {

    @Override
    public NutrientGoalsDto calculateNutrientGoals(
            Integer age,
            Integer weight,
            WeightType weightType,
            GenderType sex,
            Integer heightInInches,
            Double weightChangeAmount,
            MainGoal mainGoal,
            TrainingExperience trainingExperience) {

        // Convert weight
        double weightKg = weightType == WeightType.LBS ? weight / 2.205 : weight;

        // --- Calories (Mifflin–St Jeor BMR) ---
        double bmr = 10 * weightKg + 6.25 * (heightInInches * 2.54) - 5 * age;
        bmr += (sex == GenderType.MALE) ? 5 : -161;

        double activityFactor = switch (trainingExperience) {
            case BEGINNER -> 1.375;
            case INTERMEDIATE -> 1.55;
            default -> 1.2; // sedentary fallback
        };

        double tdee = bmr * activityFactor;

        // --- Daily adjustment from weightChangeAmount ---
        double caloriesPerUnit = (weightType == WeightType.LBS) ? 3500.0 : 7700.0;
        double dailyAdjustment = (weightChangeAmount != null)
                ? (weightChangeAmount * caloriesPerUnit / 7.0)
                : 0.0;

        double goalCalories = switch (mainGoal) {
            case LOSE_FAT -> tdee - dailyAdjustment;
            case BUILD_MUSCLE -> tdee + dailyAdjustment;
            case MAINTAIN -> tdee;
        };

        // --- Macronutrients ---
        // Protein: 2g per kg
        int proteinGrams = (int) Math.round(weightKg * 2);
        int proteinCalories = proteinGrams * 4;

        // Fat: 25% of calories
        int fatCalories = (int) (goalCalories * 0.25);
        int fatGrams = fatCalories / 9;

        // Carbs: remainder
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
            // Default floor for younger children
            potassium = 2300;
        } else if (age <= 13) {
            potassium = (sex == GenderType.FEMALE) ? 2300 : 2500;
        } else if (age <= 18) {
            potassium = (sex == GenderType.FEMALE) ? 2300 : 3000;
        }

        if (age < 18) {
            // Children: 14 g per 1,000 kcal
            fiber = (int) Math.round(goalCalories * 14.0 / 1000.0);
        } else if (age >= 50) {
            // Over 50: 22g (women), 28g (men)
            fiber = (sex == GenderType.FEMALE) ? 22 : 28;
        }

        // Build DTO
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
