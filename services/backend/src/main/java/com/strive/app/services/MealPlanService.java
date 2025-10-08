package com.strive.app.services;

import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.MealPlanEntity;
import com.strive.app.domain.entities.MealPlanId;

import java.util.UUID;

public interface MealPlanService {
    MealPlanEntity findById(MealPlanId id);

    MealPlanEntity save(MealPlanEntity mealPlanEntity);

    MealPlanEntity addToMealPlan(MealPlanId mealPlanId, FoodEntity foodEntity);
    MealPlanEntity removeFromMealPlan(MealPlanId mealPlanId, FoodEntity foodEntity);

    FoodEntity toggleItemLogged(UUID foodId);
}
