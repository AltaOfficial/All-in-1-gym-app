package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.CreateWorkoutRequestDto;
import com.strive.app.domain.dto.ExerciseDto;
import com.strive.app.domain.dto.ExerciseInputDto;
import com.strive.app.domain.dto.UpdateWorkoutRequestDto;
import com.strive.app.domain.dto.WorkoutDto;
import com.strive.app.domain.entities.ExerciseEntity;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.domain.entities.WorkoutEntity;
import com.strive.app.mcp.support.McpOwnership;
import com.strive.app.security.CurrentUserProvider;
import com.strive.app.services.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class WorkoutTools {

    private final ExerciseService exerciseService;
    private final CurrentUserProvider currentUser;
    private final McpOwnership ownership;

    @McpTool(name = "getAllWorkouts",
            description = "List the current user's saved workout routines (templates), including each "
                    + "exercise with its target sets, reps, rest and weight. Does not include "
                    + "completed-session history - use getWorkoutHistory for that.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<WorkoutDto> getAllWorkouts() {
        UUID userId = currentUser.requireId();
        return exerciseService.findAllWorkoutsByUserId(userId).stream()
                .map(this::toLeanWorkoutDto)
                .toList();
    }

    @McpTool(name = "getWorkout",
            description = "Get one of the current user's saved workout routines by id, including its exercises.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public WorkoutDto getWorkout(
            @McpToolParam(description = "Id of the workout, from getAllWorkouts") UUID workoutId) {
        UUID userId = currentUser.requireId();
        WorkoutEntity workout = ownership.workout(workoutId, userId);
        return toLeanWorkoutDto(workout);
    }

    @McpTool(name = "createWorkout",
            description = "Create a new workout routine (template) for the current user, with an ordered list "
                    + "of exercises. Before calling this tool, describe the workout you're about to create "
                    + "(name and exercises) and wait for the user to confirm. Do not call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = false))
    public WorkoutDto createWorkout(@McpToolParam(description = "The workout to create") CreateWorkoutRequestDto request) {
        UserEntity me = currentUser.require();

        WorkoutEntity workout = WorkoutEntity.builder()
                .workoutName(request.getWorkoutName())
                .userCreatedBy(me)
                .exercises(new ArrayList<>())
                .build();

        if (request.getExercises() != null) {
            for (ExerciseInputDto input : request.getExercises()) {
                ExerciseEntity exercise = ExerciseEntity.builder()
                        .exerciseName(input.getExerciseName())
                        .restTimeInSeconds(input.getRestTimeInSeconds())
                        .goalSets(input.getGoalSets())
                        .goalReps(input.getGoalReps())
                        .isWeightBased(input.getIsWeightBased())
                        .weight(input.getWeight())
                        .time(input.getTime())
                        .build();
                exercise.setWorkoutConnectedTo(workout);
                workout.getExercises().add(exercise);
            }
        }

        return toLeanWorkoutDto(exerciseService.saveWorkout(workout));
    }

    @McpTool(name = "updateWorkout",
            description = "Replace the name and/or exercise list of an existing workout routine. The exercise "
                    + "list you provide REPLACES the current one - any existing exercise whose id is omitted is "
                    + "permanently deleted along with its logged history. Before calling this tool, describe "
                    + "exactly what will change (renamed, exercises added/removed/modified) and wait for the "
                    + "user to confirm. Do not call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = true))
    public WorkoutDto updateWorkout(@McpToolParam(description = "The update to apply") UpdateWorkoutRequestDto request) {
        UUID userId = currentUser.requireId();
        WorkoutEntity existing = ownership.workout(request.getWorkoutId(), userId);

        Map<UUID, ExerciseEntity> existingById = existing.getExercises().stream()
                .filter(e -> e.getId() != null)
                .collect(Collectors.toMap(ExerciseEntity::getId, e -> e));

        List<ExerciseEntity> sourceExercises = new ArrayList<>();
        if (request.getExercises() != null) {
            for (ExerciseInputDto input : request.getExercises()) {
                ExerciseEntity.ExerciseEntityBuilder builder = ExerciseEntity.builder()
                        .id(input.getId())
                        .exerciseName(input.getExerciseName())
                        .restTimeInSeconds(input.getRestTimeInSeconds())
                        .goalSets(input.getGoalSets())
                        .goalReps(input.getGoalReps())
                        .isWeightBased(input.getIsWeightBased())
                        .weight(input.getWeight())
                        .time(input.getTime());

                // Preserve the image and tutorial URL of any exercise being kept - the source
                // entity we hand to ExerciseService.updateWorkout has neither field, and that
                // service unconditionally copies both from source to target.
                ExerciseEntity existingMatch = input.getId() != null ? existingById.get(input.getId()) : null;
                if (existingMatch != null) {
                    builder.exerciseImageUrl(existingMatch.getExerciseImageUrl())
                            .tutorialUrl(existingMatch.getTutorialUrl());
                }

                sourceExercises.add(builder.build());
            }
        }

        WorkoutEntity source = WorkoutEntity.builder()
                .id(request.getWorkoutId())
                .workoutName(request.getWorkoutName() != null ? request.getWorkoutName() : existing.getWorkoutName())
                .exercises(sourceExercises)
                .build();

        return toLeanWorkoutDto(exerciseService.updateWorkout(source));
    }

    @McpTool(name = "deleteWorkout",
            description = "Permanently delete one of the current user's workout routines. This also deletes "
                    + "every logged session of this workout. Before calling this tool, name the workout you're "
                    + "about to delete and warn that its session history will be deleted too, then wait for the "
                    + "user to confirm. Do not call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = true))
    public String deleteWorkout(@McpToolParam(description = "Id of the workout to delete") UUID workoutId) {
        UUID userId = currentUser.requireId();
        WorkoutEntity workout = ownership.workout(workoutId, userId);
        exerciseService.deleteWorkout(workout.getId());
        return "Deleted workout \"" + workout.getWorkoutName() + "\" and its logged sessions.";
    }

    private WorkoutDto toLeanWorkoutDto(WorkoutEntity entity) {
        List<ExerciseDto> exercises = entity.getExercises() == null
                ? List.of()
                : entity.getExercises().stream().map(this::toLeanExerciseDto).toList();

        return WorkoutDto.builder()
                .id(entity.getId())
                .userCreatedById(entity.getUserCreatedBy() != null ? entity.getUserCreatedBy().getId() : null)
                .workoutName(entity.getWorkoutName())
                .exercises(exercises)
                .build();
    }

    private ExerciseDto toLeanExerciseDto(ExerciseEntity entity) {
        return ExerciseDto.builder()
                .id(entity.getId())
                .exerciseName(entity.getExerciseName())
                .exerciseImageUrl(entity.getExerciseImageUrl())
                .restTimeInSeconds(entity.getRestTimeInSeconds())
                .goalSets(entity.getGoalSets())
                .goalReps(entity.getGoalReps())
                .isWeightBased(entity.getIsWeightBased())
                .weight(entity.getWeight())
                .time(entity.getTime())
                .tutorialUrl(entity.getTutorialUrl())
                .build();
    }
}
