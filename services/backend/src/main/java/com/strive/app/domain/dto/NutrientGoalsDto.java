package com.strive.app.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NutrientGoalsDto {
    private Integer goalCalories;

    private Integer goalProtein;
    private Integer goalCarbohydrates;
    private Integer goalFat;

    private Integer goalFiber;
    private Integer goalSugar;
    private Integer goalSaturatedFat;
    @Builder.Default
    private Integer goalPolyunsaturatedFat = 0;
    @Builder.Default
    private Integer goalMonounsaturatedFat = 0;
    @Builder.Default
    private Integer goalTransFat = 0;
    private Integer goalCholesterol;
    private Integer goalSodium;
    private Integer goalPotassium;
}
