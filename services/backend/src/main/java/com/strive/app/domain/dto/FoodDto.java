package com.strive.app.domain.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodDto {
    private UUID id;
    private UUID userId;            // instead of UserEntity
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

    private List<PortionDto> portions;

    private Double servingSize;
    private String servingUnit;
    private String householdServingText;
}
