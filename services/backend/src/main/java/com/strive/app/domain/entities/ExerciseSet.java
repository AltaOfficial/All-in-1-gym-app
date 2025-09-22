package com.strive.app.domain.entities;

import com.strive.app.enums.ExerciseEffortType;
import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseSet {

    private Integer repsDone;

    @Enumerated(EnumType.STRING)
    private ExerciseEffortType effortType;

    private String note;
}