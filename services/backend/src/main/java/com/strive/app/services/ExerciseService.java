package com.strive.app.services;

import com.strive.app.domain.entities.ExerciseEntity;
import com.strive.app.domain.entities.ExerciseLogEntity;
import com.strive.app.domain.entities.ExerciseSet;
import com.strive.app.domain.entities.WorkoutEntity;

import java.util.List;
import java.util.UUID;

public interface ExerciseService {

    // Exercise CRUD operations
    ExerciseEntity save(ExerciseEntity exerciseEntity);

    ExerciseEntity findById(UUID id);

    List<ExerciseEntity> findAllByWorkoutId(UUID workoutId);

    void delete(UUID id);

    // Exercise Log operations
    ExerciseLogEntity saveExerciseLog(ExerciseLogEntity exerciseLogEntity);

    ExerciseLogEntity saveOrUpdateExerciseLog(UUID exerciseLogId, UUID workoutLogId, UUID exerciseParentId, List<ExerciseSet> sets);

    ExerciseLogEntity findExerciseLogById(UUID id);

    List<ExerciseLogEntity> findAllExerciseLogsByWorkoutId(UUID workoutId);

    void deleteExerciseLog(UUID id);

    // Workout operations
    WorkoutEntity saveWorkout(WorkoutEntity workoutEntity);

    WorkoutEntity updateWorkout(WorkoutEntity workoutEntity);

    WorkoutEntity findWorkoutById(UUID id);

    List<WorkoutEntity> findAllWorkoutsByUserId(UUID userId);

    void deleteWorkout(UUID id);
}
