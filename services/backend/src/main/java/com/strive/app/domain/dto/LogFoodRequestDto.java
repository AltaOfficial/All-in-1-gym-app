package com.strive.app.domain.dto;

import com.strive.app.enums.MealType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogFoodRequestDto {
    private String foodName;
    private String brandName;

    private LocalTime time;

    private String servingSize;
    private Double servings;

    private MealType mealType;

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
}
