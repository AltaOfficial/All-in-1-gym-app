package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.ai.mcp.annotation.McpToolParam;

import java.util.UUID;

/**
 * Lean, LLM-facing input shape for one exercise within a create/update-workout MCP tool call.
 * Deliberately excludes image/tutorial URLs and base64 image fields - those stay app-managed.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseInputDto {

    @McpToolParam(required = false,
            description = "Id of an existing exercise to keep/update. Omit to add a new exercise.")
    private UUID id;

    @McpToolParam(description = "Exercise name, e.g. 'Barbell Bench Press'")
    private String exerciseName;

    @McpToolParam(required = false, description = "Target number of sets")
    private Integer goalSets;

    @McpToolParam(required = false, description = "Target reps per set")
    private Integer goalReps;

    @McpToolParam(required = false, description = "Rest between sets, in seconds")
    private Integer restTimeInSeconds;

    @McpToolParam(required = false,
            description = "True for weighted exercises, false for bodyweight or timed exercises")
    private Boolean isWeightBased;

    @McpToolParam(required = false,
            description = "Working weight, in the user's weight unit (see getMyProfile for weightType)")
    private Double weight;

    @McpToolParam(required = false, description = "Duration in seconds, for timed exercises")
    private Integer time;
}
