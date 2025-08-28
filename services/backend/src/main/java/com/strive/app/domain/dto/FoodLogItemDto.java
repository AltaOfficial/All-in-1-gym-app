package com.strive.app.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.strive.app.domain.entities.FoodLogEntity;
import com.strive.app.enums.MealType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodLogItemDto {
    private UUID id;

    private MealType mealType;

    @JsonIgnore
    private FoodLogEntity foodLogEntity;

    private String foodName;
    private String brandName;

    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;

    private LocalTime time;

    private String servingSize;
    private Double servings;
}
