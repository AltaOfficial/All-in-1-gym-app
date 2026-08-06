package com.strive.app.mcp.support;

import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.GroceryListItemEntity;
import com.strive.app.domain.entities.WorkoutEntity;
import com.strive.app.domain.entities.WorkoutLogEntity;
import com.strive.app.services.ExerciseService;
import com.strive.app.services.FoodsService;
import com.strive.app.services.GroceryListService;
import com.strive.app.services.WorkoutLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.NoSuchElementException;
import java.util.UUID;

/**
 * Ownership guards for MCP tools that accept a single-UUID id from the model.
 * <p>
 * Composite-key entities (MealId, RecipeId, MealPlanId, GroceryListId, MetricsId, BodyMetricsId,
 * FoodLogId) are safe by construction as long as every tool builds the id from the current
 * user's id and never accepts a userId parameter - see the various *Tools classes.
 * <p>
 * Single-UUID entities (workouts, workout logs, foods, grocery items) have no ownership check
 * anywhere in the service layer, so any tool that accepts one of these ids as a parameter from
 * the model MUST route through here first. On a miss or a mismatch this throws the identical
 * message either way, so a caller (here, an LLM) can't use the tool as an existence oracle over
 * other users' data.
 */
@Component
@RequiredArgsConstructor
public class McpOwnership {

    private final ExerciseService exerciseService;
    private final WorkoutLogService workoutLogService;
    private final FoodsService foodsService;
    private final GroceryListService groceryListService;

    public WorkoutEntity workout(UUID id, UUID userId) {
        WorkoutEntity workout;
        try {
            workout = exerciseService.findWorkoutById(id);
        } catch (NoSuchElementException ex) {
            throw notYours("workout", id);
        }
        if (workout.getUserCreatedBy() == null || !userId.equals(workout.getUserCreatedBy().getId())) {
            throw notYours("workout", id);
        }
        return workout;
    }

    public WorkoutLogEntity workoutLog(UUID id, UUID userId) {
        WorkoutLogEntity workoutLog;
        try {
            workoutLog = workoutLogService.findById(id);
        } catch (NoSuchElementException ex) {
            throw notYours("workout log", id);
        }
        if (workoutLog.getUser() == null || !userId.equals(workoutLog.getUser().getId())) {
            throw notYours("workout log", id);
        }
        return workoutLog;
    }

    public FoodEntity food(UUID id, UUID userId) {
        FoodEntity food;
        try {
            food = foodsService.findById(id);
        } catch (NoSuchElementException ex) {
            throw notYours("food", id);
        }
        // Foods with no owner (USDA search results, or foods attached only to a meal/recipe/meal
        // plan) are treated as not-yours - there is nothing to compare against.
        if (food.getUserCreatedBy() == null || !userId.equals(food.getUserCreatedBy().getId())) {
            throw notYours("food", id);
        }
        return food;
    }

    public GroceryListItemEntity groceryItem(UUID id, UUID userId) {
        GroceryListItemEntity item;
        try {
            item = groceryListService.findById(id);
        } catch (NoSuchElementException ex) {
            throw notYours("grocery item", id);
        }
        if (item.getGroceryListEntity() == null || item.getGroceryListEntity().getId() == null
                || !userId.equals(item.getGroceryListEntity().getId().getUserId())) {
            throw notYours("grocery item", id);
        }
        return item;
    }

    private static NoSuchElementException notYours(String kind, UUID id) {
        return new NoSuchElementException("No " + kind + " with id " + id + " belongs to you.");
    }
}
