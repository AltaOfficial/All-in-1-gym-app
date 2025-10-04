package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseLogDto {

    private UUID id;
    private UUID exerciseParentId;
    private List<ExerciseSetDto> setsList;
    private UUID workoutLogId;
}
