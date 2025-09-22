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
public class ExerciseLogRequestDto {

    private UUID exerciseParentId;
    private Date date;
    private List<ExerciseSetDto> setsList;
    private Double weight;
    private Integer time;
}
