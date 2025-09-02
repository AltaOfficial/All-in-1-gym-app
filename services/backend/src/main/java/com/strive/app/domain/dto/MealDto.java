package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealDto {
    private UUID id;
    private UUID userId;          // from meal.userCreatedBy.id
    private String mealName;
    private String mealImageUrl;  // serialize URL as string for clients
    private List<FoodDto> foodItems;
}