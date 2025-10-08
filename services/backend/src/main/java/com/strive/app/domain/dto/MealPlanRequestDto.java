package com.strive.app.domain.dto;

import com.strive.app.domain.entities.MealPlanId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MealPlanRequestDto {
    private LocalDate date;
    private MealPlanId mealPlanId;
    private FoodDto mealPlanItemDto;
    private UUID foodId; // For toggling or removing specific items
}
