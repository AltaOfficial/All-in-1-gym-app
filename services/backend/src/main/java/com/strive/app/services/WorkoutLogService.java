package com.strive.app.services;

import com.strive.app.domain.entities.WorkoutLogEntity;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface WorkoutLogService {

    WorkoutLogEntity createWorkoutLog(Date date, UUID workoutId);

    WorkoutLogEntity findById(UUID id);

    List<WorkoutLogEntity> findByDateRange(Date startDate, Date endDate);

    void deleteWorkoutLog(UUID id);
}
