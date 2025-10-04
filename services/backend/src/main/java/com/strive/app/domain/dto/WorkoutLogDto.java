package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutLogDto {

    private UUID id;
    private Date date;
    private List<ExerciseLogDto> exerciseLogs;
    private UUID workoutId;
    private UUID userId;
}
