package com.strive.app.domain.dto;

import com.strive.app.enums.ExerciseEffortType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSetDto {

    private Integer repsDone;
    private ExerciseEffortType effortType;
    private String note;
    private Double weight;
    private Integer restTimeInSeconds;
}
