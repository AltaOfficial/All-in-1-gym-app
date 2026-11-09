package com.strive.app.domain.dto;

import com.strive.app.enums.MainGoal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SettingsUpdateRequestDto {
    private MainGoal mainGoal;
    private Integer weight;
    private Integer heightInInches;
    private Integer age;
    private Double weightChangeAmount;
    // Null leaves it unchanged, 0 switches back to automatic calories, anything else fixes the goal
    private Integer customCalorieGoal;
}
