package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.FoodDto;
import com.strive.app.domain.dto.RecipeDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.RecipeEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RecipeMapper implements Mapper<RecipeEntity, RecipeDto> {
    private final ModelMapper modelMapper = new ModelMapper();
    private final Mapper<FoodEntity, FoodDto> foodMapper;

    @Override
    public RecipeDto mapTo(RecipeEntity recipeEntity) {
        RecipeDto recipeDto = modelMapper.map(recipeEntity, RecipeDto.class);
        recipeDto.setIngredients(recipeEntity.getIngredients().stream().map(foodMapper::mapTo).collect(Collectors.toList()));
        return recipeDto;
    }

    @Override
    public RecipeEntity mapFrom(RecipeDto recipeDto) {
        RecipeEntity recipeEntity = modelMapper.map(recipeDto, RecipeEntity.class);
        recipeEntity.setIngredients(recipeDto.getIngredients().stream().map(foodMapper::mapFrom).collect(Collectors.toList()));
        recipeEntity.getIngredients().forEach(food -> food.setRecipeConnectedTo(recipeEntity));
        return recipeEntity;
    }
}
