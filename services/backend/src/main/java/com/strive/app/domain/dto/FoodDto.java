package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FoodDto {

    private UUID id;

    private UUID userCreatedById;
    private UUID mealConnectedToId;
    private UUID mealPlanConnectedToId;
    private UUID recipeConnectedToId;
    private UUID inUserRecentsId;

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

    private LocalDateTime createdAt;
    private String foodImageUrl;
    private Boolean isLogged;
    private String mealType; // BREAKFAST / LUNCH / DINNER
    private Integer servingsAmount;
}
