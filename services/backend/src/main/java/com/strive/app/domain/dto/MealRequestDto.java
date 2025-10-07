package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MealRequestDto {
    private UUID id;  // For update operations
    private String mealName;
    private String mealImageFileName;
    private String mealImageBase64;
    private String mealImageMimeType;
    private List<FoodDto> foodItems;
}
