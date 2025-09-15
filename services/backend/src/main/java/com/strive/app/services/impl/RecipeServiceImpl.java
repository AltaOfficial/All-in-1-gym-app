package com.strive.app.services.impl;

import com.strive.app.domain.entities.RecipeEntity;
import com.strive.app.domain.entities.RecipeId;
import com.strive.app.repositories.RecipeRepository;
import com.strive.app.services.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecipeServiceImpl implements RecipeService {
    private final RecipeRepository recipeRepository;

    @Override
    public RecipeEntity findById(RecipeId id) {
        return recipeRepository.findById(id).orElseThrow();
    }

    @Override
    public List<RecipeEntity> findAllByUserId(UUID id) {
        return recipeRepository.findAllByIdUserId(id);
    }

    @Override
    public RecipeEntity save(RecipeEntity recipeEntity) {
        System.out.println(recipeEntity);
        return recipeRepository.save(recipeEntity);
    }

    @Override
    public void deleteRecipe(RecipeId id) {
        recipeRepository.deleteById(id);
    }
}
