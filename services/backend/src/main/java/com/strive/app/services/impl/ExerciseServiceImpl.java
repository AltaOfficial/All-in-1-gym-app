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

import java.util.*;
import java.util.stream.Collectors;

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
    public WorkoutEntity saveWorkout(WorkoutEntity workoutEntity) {
        return workoutRepository.save(workoutEntity);
    }

    @Transactional
    @Override
    public WorkoutEntity updateWorkout(WorkoutEntity workoutEntity) {
        WorkoutEntity foundWorkoutEntity = workoutRepository.findById(workoutEntity.getId())
                .orElseThrow();

        foundWorkoutEntity.setWorkoutName(workoutEntity.getWorkoutName());

        List<ExerciseEntity> existingExercises = foundWorkoutEntity.getExercises();
        List<ExerciseEntity> newExercises = workoutEntity.getExercises();

        // Build map of existing exercises by UUID
        Map<UUID, ExerciseEntity> existingMap = existingExercises.stream()
                .collect(Collectors.toMap(ExerciseEntity::getId, e -> e));

        // Track which UUIDs we're keeping
        Set<UUID> idsToKeep = new HashSet<>();

        // Process all new exercises
        for (ExerciseEntity newExercise : newExercises) {
            if (newExercise.getId() != null && existingMap.containsKey(newExercise.getId())) {
                // Update existing exercise
                ExerciseEntity existingExercise = existingMap.get(newExercise.getId());
                updateExerciseFields(existingExercise, newExercise);
                idsToKeep.add(newExercise.getId());
            } else {
                // Add new exercise (ID is null or not found)
                newExercise.setWorkoutConnectedTo(foundWorkoutEntity);
                existingExercises.add(newExercise);
                // Don't add to idsToKeep since new exercises don't have IDs yet
            }
        }

        // Remove exercises that weren't in the update (only check exercises with IDs)
        existingExercises.removeIf(existing ->
            existing.getId() != null && !idsToKeep.contains(existing.getId())
        );

        return workoutRepository.save(foundWorkoutEntity);
    }

    private void updateExerciseFields(ExerciseEntity target, ExerciseEntity source) {
        target.setExerciseName(source.getExerciseName());
        target.setExerciseImageUrl(source.getExerciseImageUrl());
        target.setRestTimeInSeconds(source.getRestTimeInSeconds());
        target.setGoalSets(source.getGoalSets());
        target.setGoalReps(source.getGoalReps());
        target.setIsWeightBased(source.getIsWeightBased());
        target.setWeight(source.getWeight());
        target.setTime(source.getTime());
        target.setTutorialUrl(source.getTutorialUrl());
        // Note: Don't copy workoutConnectedTo or exerciseLogs
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
    @Transactional
    public void deleteWorkout(UUID id) {
        // First, delete all workout logs that reference this workout
        List<WorkoutLogEntity> workoutLogs = workoutLogRepository.findAll().stream()
                .filter(log -> log.getWorkout() != null && log.getWorkout().getId().equals(id))
                .toList();

        workoutLogRepository.deleteAll(workoutLogs);

        // Then delete the workout itself
        workoutRepository.deleteById(id);
    }
}
