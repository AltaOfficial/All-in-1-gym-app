package com.strive.app.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsdaFoodNutrientDetails {
    private String nutrientName;
    private String unitName;
    private Double value;
    private String derivationCode;
    private String derivationDescription;
}
