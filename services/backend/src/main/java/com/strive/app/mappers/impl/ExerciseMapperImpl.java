package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.ExerciseDto;
import com.strive.app.domain.entities.ExerciseEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExerciseMapperImpl implements Mapper<ExerciseEntity, ExerciseDto> {

    private final ModelMapper modelMapper;

    @Override
    public ExerciseDto mapTo(ExerciseEntity exerciseEntity) {
        return modelMapper.map(exerciseEntity, ExerciseDto.class);
    }

    @Override
    public ExerciseEntity mapFrom(ExerciseDto exerciseDto) {
        return modelMapper.map(exerciseDto, ExerciseEntity.class);
    }
}
