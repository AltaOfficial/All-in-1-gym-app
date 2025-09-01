package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.GroceryListItemDto;
import com.strive.app.domain.entities.GroceryListItemEntity;
import com.strive.app.mappers.Mapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GroceryItemMapperImpl implements Mapper<GroceryListItemEntity, GroceryListItemDto> {
    private final ModelMapper modelMapper;

    @PostConstruct
    public void init() {
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);
    }

    @Override
    public GroceryListItemDto mapTo(GroceryListItemEntity groceryListItemEntity) {
        return modelMapper.map(groceryListItemEntity, GroceryListItemDto.class);
    }

    @Override
    public GroceryListItemEntity mapFrom(GroceryListItemDto groceryListItemDto) {
        return modelMapper.map(groceryListItemDto, GroceryListItemEntity.class);
    }
}
