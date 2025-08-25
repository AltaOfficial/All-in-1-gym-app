package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MetricsDto {

    private UUID userId;
    private LocalDate date;

    private Integer currentCalories;
    private Integer goalCalories;
    private Integer burnedCalories;

    private Integer protein;
    private Integer goalProtein;

    private Integer carbohydrates;
    private Integer goalCarbohydrates;

    private Integer fat;
    private Integer goalFat;

    private Integer fiber;
    private Integer goalFiber;

    private Integer sugar;
    private Integer goalSugar;

    private Integer saturatedFat;
    private Integer goalSaturatedFat;

    private Integer polyunsaturatedFat;
    private Integer goalPolyunsaturatedFat;

    private Integer monounsaturatedFat;
    private Integer goalMonounsaturatedFat;

    private Integer transFat;
    private Integer goalTransFat;

    private Integer cholesterol;
    private Integer goalCholesterol;

    private Integer sodium;
    private Integer goalSodium;

    private Integer potassium;
    private Integer goalPotassium;
}
