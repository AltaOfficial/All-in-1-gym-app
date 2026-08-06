package com.strive.app.mcp.support;

import com.strive.app.domain.dto.FoodInputDto;
import com.strive.app.domain.entities.FoodEntity;

/**
 * Builds a bare {@link FoodEntity} from the lean, LLM-facing {@link FoodInputDto}. Callers are
 * responsible for setting whichever relationship applies (userCreatedBy, mealConnectedTo,
 * recipeConnectedTo, or mealPlanConnectedTo) - this only fills the scalar nutrition fields.
 */
public final class McpFoodInputs {

    private McpFoodInputs() {
    }

    public static FoodEntity toEntity(FoodInputDto food) {
        return FoodEntity.builder()
                .foodName(food.getFoodName())
                .foodBrandName(food.getFoodBrandName())
                .servingSize(food.getServingSize())
                .servingUnit(food.getServingUnit())
                .householdServingText(food.getHouseholdServingText())
                .calories(food.getCalories())
                .protein(food.getProtein())
                .carbohydrates(food.getCarbohydrates())
                .fat(food.getFat())
                .fiber(food.getFiber())
                .sugar(food.getSugar())
                .saturatedFat(food.getSaturatedFat())
                .sodium(food.getSodium())
                .build();
    }
}
