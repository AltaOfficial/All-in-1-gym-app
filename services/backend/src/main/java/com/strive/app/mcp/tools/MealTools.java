package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.FoodInputDto;
import com.strive.app.domain.dto.MealDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.MealEntity;
import com.strive.app.domain.entities.MealId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.mcp.support.McpFoodInputs;
import com.strive.app.security.CurrentUserProvider;
import com.strive.app.services.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MealTools {

    private final MealService mealService;
    private final CurrentUserProvider currentUser;
    private final Mapper<MealEntity, MealDto> mealMapper;

    @McpTool(name = "getMyMeals",
            description = "List the current user's saved meals (named groups of foods), each with its food items.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<MealDto> getMyMeals() {
        UUID userId = currentUser.requireId();
        return mealService.findAllByUserId(userId).stream().map(mealMapper::mapTo).toList();
    }

    @McpTool(name = "createMeal",
            description = "Save a new named meal (a group of foods) to the current user's meal library. Before "
                    + "calling this tool, describe the meal you're about to create (name and foods) and wait "
                    + "for the user to confirm. Do not call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = false))
    public MealDto createMeal(
            @McpToolParam(description = "Meal name, e.g. 'Post-workout shake'") String mealName,
            @McpToolParam(description = "Foods that make up this meal") List<FoodInputDto> foods) {
        UserEntity me = currentUser.require();

        MealEntity meal = MealEntity.builder()
                .id(MealId.builder().userId(me.getId()).build())
                .mealName(mealName)
                .foodItems(new ArrayList<>())
                .build();

        if (foods != null) {
            for (FoodInputDto input : foods) {
                FoodEntity food = McpFoodInputs.toEntity(input);
                food.setMealConnectedTo(meal);
                meal.getFoodItems().add(food);
            }
        }

        return mealMapper.mapTo(mealService.save(meal));
    }

    @McpTool(name = "updateMeal",
            description = "Replace the name and/or food list of an existing meal. The food list you provide "
                    + "REPLACES the current one. Before calling this tool, describe exactly what will change "
                    + "and wait for the user to confirm. Do not call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = true))
    public MealDto updateMeal(
            @McpToolParam(description = "Id of the meal to update") UUID mealId,
            @McpToolParam(required = false, description = "New name. Omit to keep the current name.") String mealName,
            @McpToolParam(description = "The complete food list, which REPLACES the current one") List<FoodInputDto> foods) {
        UserEntity me = currentUser.require();
        MealId id = MealId.builder().id(mealId).userId(me.getId()).build();
        MealEntity existing = findOwnedMeal(id, mealId);

        MealEntity updated = MealEntity.builder()
                .id(id)
                .mealName(mealName != null ? mealName : existing.getMealName())
                .mealImageUrl(existing.getMealImageUrl())
                .foodItems(new ArrayList<>())
                .build();

        if (foods != null) {
            for (FoodInputDto input : foods) {
                FoodEntity food = McpFoodInputs.toEntity(input);
                food.setMealConnectedTo(updated);
                updated.getFoodItems().add(food);
            }
        }

        return mealMapper.mapTo(mealService.save(updated));
    }

    @McpTool(name = "deleteMeal",
            description = "Permanently delete one of the current user's saved meals. Before calling this tool, "
                    + "name the meal you're about to delete and wait for the user to confirm. Do not call this "
                    + "tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = true))
    public String deleteMeal(@McpToolParam(description = "Id of the meal to delete") UUID mealId) {
        UserEntity me = currentUser.require();
        MealId id = MealId.builder().id(mealId).userId(me.getId()).build();
        MealEntity existing = findOwnedMeal(id, mealId);
        mealService.deleteMeal(id);
        return "Deleted meal \"" + existing.getMealName() + "\".";
    }

    private MealEntity findOwnedMeal(MealId id, UUID mealId) {
        try {
            return mealService.findById(id);
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("No meal with id " + mealId + " belongs to you.");
        }
    }
}
