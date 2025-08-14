package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.WidgetDto;
import com.strive.app.domain.entities.WidgetEntity;
import com.strive.app.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class WidgetMapperImpl implements Mapper<WidgetEntity, WidgetDto> {

    private final ModelMapper modelMapper;

    public WidgetMapperImpl(final ModelMapper modelMapper){
        this.modelMapper = modelMapper;
    }

    @Override
    public WidgetDto mapTo(WidgetEntity widgetEntity){
        return modelMapper.map(widgetEntity, WidgetDto.class);
    }

    @Override
    public WidgetEntity mapFrom(WidgetDto widgetDto){
        return modelMapper.map(widgetDto, WidgetEntity.class);
    }
}
