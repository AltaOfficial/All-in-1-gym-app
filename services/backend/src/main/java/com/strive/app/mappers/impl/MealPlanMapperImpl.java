package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.FoodDto;
import com.strive.app.domain.dto.MealPlanDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.MealPlanEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MealPlanMapperImpl implements Mapper<MealPlanEntity, MealPlanDto> {
    private final Mapper<FoodEntity, FoodDto> foodEntityFoodDtoMapper;

    @Override
    public MealPlanDto mapTo(MealPlanEntity mealPlanEntity) {
        return MealPlanDto.builder()
                .id(mealPlanEntity.getId())
                .userId(mealPlanEntity.getId().getUserId())
                .mealPlanItems(mealPlanEntity.getMealPlanItems().stream()
                        .map(foodEntityFoodDtoMapper::mapTo)
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    public MealPlanEntity mapFrom(MealPlanDto mealPlanDto) {
        return MealPlanEntity.builder()
                .id(mealPlanDto.getId())
                .mealPlanItems(mealPlanDto.getMealPlanItems().stream()
                        .map(foodEntityFoodDtoMapper::mapFrom)
                        .collect(Collectors.toList()))
                .build();
    }
}
