package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.ai.mcp.annotation.McpToolParam;

/**
 * Lean, LLM-facing input shape for one food item, used when creating a custom food or adding
 * an ingredient to a meal, recipe, or meal-plan slot. Excludes image fields, brand-owner, and
 * every relational id - those are set by the tool layer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodInputDto {

    @McpToolParam(description = "Food name")
    private String foodName;

    @McpToolParam(required = false, description = "Brand name, if any")
    private String foodBrandName;

    @McpToolParam(required = false, description = "Numeric serving size, grams per serving")
    private Double servingSize;

    @McpToolParam(required = false, description = "Serving unit, e.g. 'g' or 'ml'")
    private String servingUnit;

    @McpToolParam(required = false, description = "Household serving description, e.g. '1 cup'")
    private String householdServingText;

    @McpToolParam(required = false, description = "Calories per serving")
    private Double calories;

    @McpToolParam(required = false, description = "Protein in grams per serving")
    private Double protein;

    @McpToolParam(required = false, description = "Carbohydrates in grams per serving")
    private Double carbohydrates;

    @McpToolParam(required = false, description = "Fat in grams per serving")
    private Double fat;

    @McpToolParam(required = false, description = "Fiber in grams per serving")
    private Double fiber;

    @McpToolParam(required = false, description = "Sugar in grams per serving")
    private Double sugar;

    @McpToolParam(required = false, description = "Saturated fat in grams per serving")
    private Double saturatedFat;

    @McpToolParam(required = false, description = "Sodium in milligrams per serving")
    private Double sodium;
}
