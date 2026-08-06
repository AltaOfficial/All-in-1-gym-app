package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.ai.mcp.annotation.McpToolParam;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateWorkoutRequestDto {

    @McpToolParam(description = "Id of the workout to update")
    private UUID workoutId;

    @McpToolParam(required = false, description = "New name for the workout. Omit to keep the current name.")
    private String workoutName;

    @McpToolParam(description = "The complete ordered exercise list, which REPLACES the current one. "
            + "Include the id of every exercise you want to keep; any omitted exercise is deleted along with "
            + "its logged history.")
    private List<ExerciseInputDto> exercises;
}
