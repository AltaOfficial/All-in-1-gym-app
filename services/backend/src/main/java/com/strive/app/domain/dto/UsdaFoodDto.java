package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsdaFoodDto {
    private String description;
    private String dataType;
    private List<UsdaFoodNutrientDetails> foodNutrients;
    private String brandOwner;
    private String brandName;
    private Double servingSize;
    private String servingSizeUnit;
    private String householdServingFullText;
}
