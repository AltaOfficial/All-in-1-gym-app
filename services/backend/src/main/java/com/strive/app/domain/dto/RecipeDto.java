package com.strive.app.domain.dto;

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
public class RecipeDto {
    private UUID id;
    private UUID userId;

    private String recipeName;
    private Integer servingsAmount;

    @Builder.Default
    private List<FoodDto> ingredients  = new ArrayList<>();
}