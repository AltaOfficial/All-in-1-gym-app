package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.MetricsDto;
import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MetricsMapper implements Mapper<MetricsEntity, MetricsDto> {
    private final ModelMapper modelMapper;

    @Override
    public MetricsDto mapTo(MetricsEntity metricsEntity) {
        return modelMapper.map(metricsEntity, MetricsDto.class);
    }

    @Override
    public MetricsEntity mapFrom(MetricsDto metricsDto) {
        return modelMapper.map(metricsDto, MetricsEntity.class);
    }
}
