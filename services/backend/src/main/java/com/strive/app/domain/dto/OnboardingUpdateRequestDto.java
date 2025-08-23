package com.strive.app.domain.dto;


import com.strive.app.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OnboardingUpdateRequestDto {
    private Integer weight;
    private WeightType weightType;
    private Integer age;
    private Integer heightInInches;
    private GenderType sexType;
    private TrainingExperience trainingExperience;
    private MainGoal mainGoal;
    private Double weightChangeAmount;
}
