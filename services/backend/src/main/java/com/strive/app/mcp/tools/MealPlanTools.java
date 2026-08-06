package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.FoodInputDto;
import com.strive.app.domain.dto.MealPlanDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.MealPlanEntity;
import com.strive.app.domain.entities.MealPlanId;
import com.strive.app.enums.MealType;
import com.strive.app.mappers.Mapper;
import com.strive.app.mcp.support.McpDates;
import com.strive.app.mcp.support.McpFoodInputs;
import com.strive.app.security.CurrentUserProvider;
import com.strive.app.services.MealPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MealPlanTools {

    private final MealPlanService mealPlanService;
    private final CurrentUserProvider currentUser;
    private final Mapper<MealPlanEntity, MealPlanDto> mealPlanMapper;

    @McpTool(name = "getMealPlan",
            description = "Get the foods the current user has planned to eat on a given day. This is planning, "
                    + "separate from the daily food log of what was actually eaten. Omit the date for today "
                    + "(the server's current UTC date).",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public MealPlanDto getMealPlan(
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for today.") LocalDate date) {
        UUID userId = currentUser.requireId();
        LocalDate targetDate = McpDates.orToday(date);
        MealPlanId id = MealPlanId.builder().userId(userId).date(targetDate).build();
        try {
            return mealPlanMapper.mapTo(mealPlanService.findById(id));
        } catch (NoSuchElementException ex) {
            return MealPlanDto.builder().id(id).userId(userId).mealPlanItems(List.of()).build();
        }
    }

    @McpTool(name = "addFoodToMealPlan",
            description = "Add a food to the current user's meal plan for a given day. This only plans the "
                    + "food - it does not log it as eaten. Before calling this tool, describe the food and day "
                    + "you're about to add and wait for the user to confirm. Do not call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = false))
    public MealPlanDto addFoodToMealPlan(
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for today.") LocalDate date,
            @McpToolParam(description = "The food to plan") FoodInputDto food,
            @McpToolParam(required = false, description = "Which meal this food is planned for") MealType mealType,
            @McpToolParam(required = false, description = "Number of servings. Defaults to 1.") Integer servingsAmount) {
        UUID userId = currentUser.requireId();
        LocalDate targetDate = McpDates.orToday(date);
        MealPlanId id = MealPlanId.builder().userId(userId).date(targetDate).build();

        FoodEntity foodEntity = McpFoodInputs.toEntity(food);
        foodEntity.setMealType(mealType);
        foodEntity.setServingsAmount(servingsAmount != null ? servingsAmount : 1);

        return mealPlanMapper.mapTo(mealPlanService.addToMealPlan(id, foodEntity));
    }

    @McpTool(name = "removeFoodFromMealPlan",
            description = "Remove a planned food from the current user's meal plan for a given day. Before "
                    + "calling this tool, describe which planned food you're about to remove and wait for the "
                    + "user to confirm. Do not call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = true))
    public MealPlanDto removeFoodFromMealPlan(
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for today.") LocalDate date,
            @McpToolParam(description = "Id of the planned food item, from getMealPlan") UUID foodId) {
        UUID userId = currentUser.requireId();
        LocalDate targetDate = McpDates.orToday(date);
        MealPlanId id = MealPlanId.builder().userId(userId).date(targetDate).build();

        try {
            FoodEntity target = FoodEntity.builder().id(foodId).build();
            return mealPlanMapper.mapTo(mealPlanService.removeFromMealPlan(id, target));
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("No meal plan found for " + targetDate + ".");
        }
    }
}
