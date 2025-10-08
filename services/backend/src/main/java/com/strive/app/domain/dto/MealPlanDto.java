package com.strive.app.domain.dto;

import com.strive.app.domain.entities.MealPlanId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MealPlanDto {
    private MealPlanId id;
    private UUID userId;

    @Builder.Default
    private List<FoodDto> mealPlanItems = new ArrayList<>();
}
