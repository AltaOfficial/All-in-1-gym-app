package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.WorkoutLogDto;
import com.strive.app.domain.entities.WorkoutLogEntity;
import com.strive.app.mcp.support.McpOwnership;
import com.strive.app.mappers.Mapper;
import com.strive.app.security.CurrentUserProvider;
import com.strive.app.services.WorkoutLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class WorkoutLogTools {

    private final WorkoutLogService workoutLogService;
    private final CurrentUserProvider currentUser;
    private final McpOwnership ownership;
    private final Mapper<WorkoutLogEntity, WorkoutLogDto> workoutLogMapper;

    @McpTool(name = "getWorkoutHistory",
            description = "List the current user's past logged workout sessions (what was actually performed, "
                    + "including the sets done), most recent first. Optionally filter to a single workout "
                    + "routine. This is history, not the routines themselves - use getAllWorkouts for those.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<WorkoutLogDto> getWorkoutHistory(
            @McpToolParam(required = false,
                    description = "Id of a workout routine to filter to. Omit to see sessions across all workouts.")
            UUID workoutId,
            @McpToolParam(required = false, description = "Max number of sessions to return. Defaults to 20.")
            Integer limit) {
        UUID userId = currentUser.requireId();
        int cap = limit != null ? limit : 20;

        List<WorkoutLogEntity> logs = workoutId != null
                ? workoutLogService.findAllByWorkoutIdAndUserId(workoutId, userId)
                : workoutLogService.findAllByUserId(userId);

        return logs.stream().limit(cap).map(workoutLogMapper::mapTo).toList();
    }

    @McpTool(name = "getWorkoutLog",
            description = "Get one logged workout session by id, including every exercise and the sets "
                    + "actually performed (reps, weight, effort).",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public WorkoutLogDto getWorkoutLog(
            @McpToolParam(description = "Id of the workout log, from getWorkoutHistory") UUID workoutLogId) {
        UUID userId = currentUser.requireId();
        WorkoutLogEntity log = ownership.workoutLog(workoutLogId, userId);
        return workoutLogMapper.mapTo(log);
    }
}
