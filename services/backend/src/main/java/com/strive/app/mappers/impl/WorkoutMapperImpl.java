package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.WorkoutDto;
import com.strive.app.domain.entities.WorkoutEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WorkoutMapperImpl implements Mapper<WorkoutEntity, WorkoutDto> {

    private final ModelMapper modelMapper;

    @Override
    public WorkoutDto mapTo(WorkoutEntity workoutEntity) {
        return modelMapper.map(workoutEntity, WorkoutDto.class);
    }

    @Override
    public WorkoutEntity mapFrom(WorkoutDto workoutDto) {
        return modelMapper.map(workoutDto, WorkoutEntity.class);
    }
}
