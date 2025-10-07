package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.FoodDto;
import com.strive.app.domain.dto.MealDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.MealEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MealMapper implements Mapper<MealEntity, MealDto> {
    private final ModelMapper modelMapper = new ModelMapper();
    private final Mapper<FoodEntity, FoodDto> foodMapper;

    @Override
    public MealDto mapTo(MealEntity mealEntity) {
        MealDto mealDto = modelMapper.map(mealEntity, MealDto.class);
        if (mealEntity.getFoodItems() != null) {
            mealDto.setFoodItems(mealEntity.getFoodItems().stream()
                    .map(foodMapper::mapTo)
                    .collect(Collectors.toList()));
        }
        // Map the mealImageUrl to string for client
        if (mealEntity.getMealImageUrl() != null) {
            mealDto.setMealImageUrl(mealEntity.getMealImageUrl().toString());
        }
        return mealDto;
    }

    @Override
    public MealEntity mapFrom(MealDto mealDto) {
        MealEntity mealEntity = modelMapper.map(mealDto, MealEntity.class);
        if (mealDto.getFoodItems() != null) {
            mealEntity.setFoodItems(mealDto.getFoodItems().stream()
                    .map(foodMapper::mapFrom)
                    .collect(Collectors.toList()));
            // Set the mealConnectedTo relationship for each food item
            mealEntity.getFoodItems().forEach(food -> food.setMealConnectedTo(mealEntity));
        }
        return mealEntity;
    }
}
