package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.BodyMetricsLogDto;
import com.strive.app.domain.entities.BodyMetricsLogEntity;
import com.strive.app.mappers.Mapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BodyMetricsLogMapperImpl implements Mapper<BodyMetricsLogEntity, BodyMetricsLogDto> {
    private ModelMapper modelMapper;

    @PostConstruct
    public void init() {
        modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);
    }

    @Override
    public BodyMetricsLogDto mapTo(BodyMetricsLogEntity bodyMetricsLogEntity) {
        return modelMapper.map(bodyMetricsLogEntity, BodyMetricsLogDto.class);
    }

    @Override
    public BodyMetricsLogEntity mapFrom(BodyMetricsLogDto bodyMetricsLogDto) {
        return modelMapper.map(bodyMetricsLogDto, BodyMetricsLogEntity.class);
    }
}
