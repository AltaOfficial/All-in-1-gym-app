package com.strive.app.domain.dto;

import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodDto {
    private UUID id;
    private UUID userCreatedById;
    private String foodName;
    private String foodBrandName;
    private String foodBrandOwner;

    private Double calories;
    private Double protein;
    private Double carbohydrates;
    private Double fat;
    private Double fiber;
    private Double sugar;
    private Double saturatedFat;
    private Double polyunsaturatedFat;
    private Double monounsaturatedFat;
    private Double transFat;
    private Double cholesterol;
    private Double sodium;
    private Double potassium;

    private Double servingSize;
    private String servingUnit;
    private String householdServingText;

    private Integer servingsAmount;
}
