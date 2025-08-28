package com.strive.app.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.strive.app.domain.dto.UsdaFoodNutrientDetails;
import com.strive.app.domain.dto.UsdaResponseDto;
import com.strive.app.domain.dto.UsdaSearchRequestDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.services.FoodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodsServiceImpl implements FoodsService {

    private final ObjectMapper objectMapper;
    @Value("${USDA_FOODDATA_API_KEY}")
    private String usdaFoodDataApiKey;

    @Override
    public List<FoodEntity> search(String query) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        String requestBodyJson = objectMapper.writeValueAsString(UsdaSearchRequestDto.builder().query(query).build()); // converts to json string
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + usdaFoodDataApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        UsdaResponseDto usdaResponseDto = objectMapper.readValue(response.body(), UsdaResponseDto.class);
        List<FoodEntity> foods = usdaResponseDto.getFoods().stream().map(food -> {
            List<UsdaFoodNutrientDetails> nutrientsList = food.getFoodNutrients();

            return FoodEntity.builder()
                .foodName(food.getDescription())
                .foodBrandName(food.getBrandName())
                .foodBrandOwner(food.getBrandOwner())
                .calories(findNutrientValue(nutrientsList, "Energy"))
                .protein(findNutrientValue(nutrientsList, "protein"))
                .carbohydrates(findNutrientValue(nutrientsList, "carbohydrate"))
                .fat(findNutrientValue(nutrientsList, "fat"))
                .fiber(findNutrientValue(nutrientsList, "fiber"))
                .sugar(findNutrientValue(nutrientsList, "sugar"))
                .saturatedFat(findNutrientValue(nutrientsList, "saturated"))
                .polyunsaturatedFat(findNutrientValue(nutrientsList, "polyunsaturated"))
                .monounsaturatedFat(findNutrientValue(nutrientsList, "monounsaturated"))
                .transFat(findNutrientValue(nutrientsList, "trans"))
                .cholesterol(findNutrientValue(nutrientsList, "cholesterol"))
                .sodium(findNutrientValue(nutrientsList, "sodium"))
                .potassium(findNutrientValue(nutrientsList, "potassium"))
                .servingSize(food.getServingSize())
                .servingUnit(food.getServingSizeUnit())
                .householdServingText(food.getHouseholdServingFullText())
                .build();
        }).toList();
        System.out.println(foods);
        return foods;
    }

    private Double findNutrientValue(List<UsdaFoodNutrientDetails> nutrients, String nameContains){
        // dividing by 100 since we need how many nutrients are in 1 gram
        return nutrients.stream()
                .filter(n -> n.getNutrientName().toLowerCase().contains(nameContains.toLowerCase()))
                .map((usdaFoodNutrientDetails -> usdaFoodNutrientDetails.getValue()/100))
                .findFirst()
                .orElse(null);
    }
}
