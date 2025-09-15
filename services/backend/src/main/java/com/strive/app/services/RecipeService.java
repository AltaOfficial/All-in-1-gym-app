package com.strive.app.services;

import com.strive.app.domain.entities.RecipeEntity;
import com.strive.app.domain.entities.RecipeId;

import java.util.List;
import java.util.UUID;

public interface RecipeService {
    public RecipeEntity findById(RecipeId id);
    public List<RecipeEntity> findAllByUserId(UUID id);

    public RecipeEntity save(RecipeEntity recipeEntity);

    public void deleteRecipe(RecipeId id);
}
