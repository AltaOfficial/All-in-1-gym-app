package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.FoodInputDto;
import com.strive.app.domain.dto.RecipeDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.RecipeEntity;
import com.strive.app.domain.entities.RecipeId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.mcp.support.McpFoodInputs;
import com.strive.app.security.CurrentUserProvider;
import com.strive.app.services.RecipeService;
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
public class RecipeTools {

    private final RecipeService recipeService;
    private final CurrentUserProvider currentUser;
    private final Mapper<RecipeEntity, RecipeDto> recipeMapper;

    @McpTool(name = "getMyRecipes",
            description = "List the current user's saved recipes, each with its ingredients and serving count.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<RecipeDto> getMyRecipes() {
        UUID userId = currentUser.requireId();
        return recipeService.findAllByUserId(userId).stream().map(recipeMapper::mapTo).toList();
    }

    @McpTool(name = "createRecipe",
            description = "Save a new recipe with its ingredients to the current user's recipe library. Before "
                    + "calling this tool, describe the recipe you're about to create (name, servings, and "
                    + "ingredients) and wait for the user to confirm. Do not call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = false))
    public RecipeDto createRecipe(
            @McpToolParam(description = "Recipe name") String recipeName,
            @McpToolParam(required = false, description = "Number of servings this recipe makes") Integer servingsAmount,
            @McpToolParam(description = "Ingredients that make up this recipe") List<FoodInputDto> ingredients) {
        UserEntity me = currentUser.require();

        RecipeEntity recipe = RecipeEntity.builder()
                .id(RecipeId.builder().userId(me.getId()).build())
                .recipeName(recipeName)
                .servingsAmount(servingsAmount)
                .ingredients(new ArrayList<>())
                .build();

        if (ingredients != null) {
            for (FoodInputDto input : ingredients) {
                FoodEntity food = McpFoodInputs.toEntity(input);
                food.setRecipeConnectedTo(recipe);
                recipe.getIngredients().add(food);
            }
        }

        return recipeMapper.mapTo(recipeService.save(recipe));
    }

    @McpTool(name = "updateRecipe",
            description = "Replace the name, servings, and/or ingredient list of an existing recipe. The "
                    + "ingredient list you provide REPLACES the current one. Before calling this tool, describe "
                    + "exactly what will change and wait for the user to confirm. Do not call this tool "
                    + "speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = true))
    public RecipeDto updateRecipe(
            @McpToolParam(description = "Id of the recipe to update") UUID recipeId,
            @McpToolParam(required = false, description = "New name. Omit to keep the current name.") String recipeName,
            @McpToolParam(required = false, description = "New serving count. Omit to keep the current value.")
            Integer servingsAmount,
            @McpToolParam(description = "The complete ingredient list, which REPLACES the current one") List<FoodInputDto> ingredients) {
        UserEntity me = currentUser.require();
        RecipeId id = RecipeId.builder().id(recipeId).userId(me.getId()).build();
        RecipeEntity existing = findOwnedRecipe(id, recipeId);

        RecipeEntity updated = RecipeEntity.builder()
                .id(id)
                .recipeName(recipeName != null ? recipeName : existing.getRecipeName())
                .servingsAmount(servingsAmount != null ? servingsAmount : existing.getServingsAmount())
                .ingredients(new ArrayList<>())
                .build();

        if (ingredients != null) {
            for (FoodInputDto input : ingredients) {
                FoodEntity food = McpFoodInputs.toEntity(input);
                food.setRecipeConnectedTo(updated);
                updated.getIngredients().add(food);
            }
        }

        return recipeMapper.mapTo(recipeService.save(updated));
    }

    @McpTool(name = "deleteRecipe",
            description = "Permanently delete one of the current user's saved recipes. Before calling this "
                    + "tool, name the recipe you're about to delete and wait for the user to confirm. Do not "
                    + "call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = true))
    public String deleteRecipe(@McpToolParam(description = "Id of the recipe to delete") UUID recipeId) {
        UserEntity me = currentUser.require();
        RecipeId id = RecipeId.builder().id(recipeId).userId(me.getId()).build();
        RecipeEntity existing = findOwnedRecipe(id, recipeId);
        recipeService.deleteRecipe(id);
        return "Deleted recipe \"" + existing.getRecipeName() + "\".";
    }

    private RecipeEntity findOwnedRecipe(RecipeId id, UUID recipeId) {
        try {
            return recipeService.findById(id);
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("No recipe with id " + recipeId + " belongs to you.");
        }
    }
}
