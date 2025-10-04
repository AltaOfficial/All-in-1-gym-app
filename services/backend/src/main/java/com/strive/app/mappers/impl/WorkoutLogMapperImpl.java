package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.WorkoutLogDto;
import com.strive.app.domain.entities.WorkoutLogEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WorkoutLogMapperImpl implements Mapper<WorkoutLogEntity, WorkoutLogDto> {

    private final ModelMapper modelMapper;

    @Override
    public WorkoutLogDto mapTo(WorkoutLogEntity workoutLogEntity) {
        return modelMapper.map(workoutLogEntity, WorkoutLogDto.class);
    }

    @Override
    public WorkoutLogEntity mapFrom(WorkoutLogDto workoutLogDto) {
        return modelMapper.map(workoutLogDto, WorkoutLogEntity.class);
    }
}
