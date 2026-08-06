package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.ai.mcp.annotation.McpToolParam;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateWorkoutRequestDto {

    @McpToolParam(description = "Workout name, e.g. 'Push Day A'")
    private String workoutName;

    @McpToolParam(description = "Exercises, in the order they should be performed")
    private List<ExerciseInputDto> exercises;
}
