package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URL;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequestDto {

    private String exerciseName;
    private URL exerciseImageUrl;
    private UUID workoutConnectedToId;
    private Integer restTimeInSeconds;
    private Integer goalSets;
    private Integer goalReps;
    private Boolean isWeightBased;
    private Double weight;
    private Integer time;
    private URL tutorialUrl;
}
