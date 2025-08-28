package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.FoodLogItemDto;
import com.strive.app.domain.entities.FoodLogItemEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FoodLogItemMapperImpl implements Mapper<FoodLogItemEntity, FoodLogItemDto> {
    private final ModelMapper modelMapper;

    @Override
    public FoodLogItemDto mapTo(FoodLogItemEntity foodLogItemEntity) {
        return modelMapper.map(foodLogItemEntity, FoodLogItemDto.class);
    }

    @Override
    public FoodLogItemEntity mapFrom(FoodLogItemDto foodLogItemDto) {
        return modelMapper.map(foodLogItemDto, FoodLogItemEntity.class);
    }
}
