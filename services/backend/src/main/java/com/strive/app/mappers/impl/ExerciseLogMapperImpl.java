package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.ExerciseLogDto;
import com.strive.app.domain.entities.ExerciseLogEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExerciseLogMapperImpl implements Mapper<ExerciseLogEntity, ExerciseLogDto> {

    private final ModelMapper modelMapper;

    @Override
    public ExerciseLogDto mapTo(ExerciseLogEntity exerciseLogEntity) {
        return modelMapper.map(exerciseLogEntity, ExerciseLogDto.class);
    }

    @Override
    public ExerciseLogEntity mapFrom(ExerciseLogDto exerciseLogDto) {
        return modelMapper.map(exerciseLogDto, ExerciseLogEntity.class);
    }
}
