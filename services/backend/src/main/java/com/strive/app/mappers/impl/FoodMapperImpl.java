package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.FoodDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.mappers.Mapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MatchingStrategy;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FoodMapperImpl implements Mapper<FoodEntity, FoodDto> {
    private final ModelMapper modelMapper;

    @PostConstruct
    public void init() {
        // ignore null values during mapping
        // modelMapper.getConfiguration().setPropertyCondition(ctx -> ctx.getSource() != null);
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);
    }

    @Override
    public FoodDto mapTo(FoodEntity foodEntity) {
        return modelMapper.map(foodEntity, FoodDto.class);
    }

    @Override
    public FoodEntity mapFrom(FoodDto foodDto) {
        return modelMapper.map(foodDto, FoodEntity.class);
    }
}
