package com.strive.app.services.impl;

import com.strive.app.domain.entities.ExerciseEntity;
import com.strive.app.domain.entities.ExerciseLogEntity;
import com.strive.app.domain.entities.ExerciseSet;
import com.strive.app.domain.entities.WorkoutEntity;
import com.strive.app.domain.entities.WorkoutLogEntity;
import com.strive.app.repositories.ExerciseLogRepository;
import com.strive.app.repositories.ExerciseRepository;
import com.strive.app.repositories.WorkoutLogRepository;
import com.strive.app.repositories.WorkoutRepository;
import com.strive.app.services.ExerciseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseLogRepository exerciseLogRepository;
    private final WorkoutRepository workoutRepository;
    private final WorkoutLogRepository workoutLogRepository;

    // Exercise CRUD operations
    @Override
    public ExerciseEntity save(ExerciseEntity exerciseEntity) {
        return exerciseRepository.save(exerciseEntity);
    }

    @Override
    public ExerciseEntity findById(UUID id) {
        return exerciseRepository.findById(id).orElseThrow();
    }

    @Override
    public List<ExerciseEntity> findAllByWorkoutId(UUID workoutId) {
        return exerciseRepository.findAllByWorkoutConnectedToId(workoutId);
    }

    @Override
    public void delete(UUID id) {
        exerciseRepository.deleteById(id);
    }

    // Exercise Log operations
    @Override
    public ExerciseLogEntity saveExerciseLog(ExerciseLogEntity exerciseLogEntity) {
        return exerciseLogRepository.save(exerciseLogEntity);
    }

    @Override
    @Transactional
    public ExerciseLogEntity saveOrUpdateExerciseLog(UUID exerciseLogId, UUID workoutLogId, UUID exerciseParentId, List<ExerciseSet> sets) {
        ExerciseLogEntity exerciseLogEntity;

        if (exerciseLogId == null) {
            // Create new exercise log
            ExerciseEntity exerciseParent = exerciseRepository.findById(exerciseParentId).orElseThrow();
            WorkoutLogEntity workoutLog = workoutLogRepository.findById(workoutLogId).orElseThrow();

            exerciseLogEntity = ExerciseLogEntity.builder()
                    .exerciseParent(exerciseParent)
                    .workoutLog(workoutLog)
                    .setsList(new ArrayList<>(sets))
                    .build();
        } else {
            // Update existing exercise log by appending sets
            exerciseLogEntity = exerciseLogRepository.findById(exerciseLogId).orElseThrow();
            if (exerciseLogEntity.getSetsList() == null) {
                exerciseLogEntity.setSetsList(new ArrayList<>());
            }
            exerciseLogEntity.getSetsList().addAll(sets);
        }

        return exerciseLogRepository.save(exerciseLogEntity);
    }

    @Override
    public ExerciseLogEntity findExerciseLogById(UUID id) {
        return exerciseLogRepository.findById(id).orElseThrow();
    }

    @Override
    public List<ExerciseLogEntity> findAllExerciseLogsByWorkoutId(UUID workoutId) {
        return exerciseLogRepository.findAllByExerciseParentWorkoutConnectedToId(workoutId);
    }

    @Override
    public void deleteExerciseLog(UUID id) {
        exerciseLogRepository.deleteById(id);
    }

    // Workout operations
    @Override
    @Transactional
    public WorkoutEntity saveWorkout(WorkoutEntity workoutEntity) {
        return workoutRepository.save(workoutEntity);
    }

    @Transactional
    @Override
    public WorkoutEntity updateWorkout(WorkoutEntity workoutEntity) {
        WorkoutEntity foundWorkoutEntity = workoutRepository.findById(workoutEntity.getId())
                .orElseThrow();
        foundWorkoutEntity.getExercises().clear(); // Makes all foundWorkoutEntity exercises orphaned
        workoutEntity.getExercises()
                .forEach(e -> {
                    e.setWorkoutConnectedTo(foundWorkoutEntity);
                    foundWorkoutEntity.getExercises().add(e);
                });
        foundWorkoutEntity.setWorkoutName(workoutEntity.getWorkoutName());
        return workoutRepository.save(foundWorkoutEntity);
    }

    @Override
    public WorkoutEntity findWorkoutById(UUID id) {
        return workoutRepository.findById(id).orElseThrow();
    }

    @Override
    public List<WorkoutEntity> findAllWorkoutsByUserId(UUID userId) {
        return workoutRepository.findAllByUserCreatedById(userId);
    }

    @Override
    public void deleteWorkout(UUID id) {
        workoutRepository.deleteById(id);
    }
}
