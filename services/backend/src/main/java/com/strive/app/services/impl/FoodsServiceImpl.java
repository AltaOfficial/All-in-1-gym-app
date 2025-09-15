package com.strive.app.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.strive.app.domain.dto.UsdaFoodNutrientDetails;
import com.strive.app.domain.dto.UsdaResponseDto;
import com.strive.app.domain.dto.UsdaSearchRequestDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.repositories.FoodRepository;
import com.strive.app.services.FoodsService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FoodsServiceImpl implements FoodsService {

    private final ObjectMapper objectMapper;
    private final FoodRepository foodRepository;
    @Value("${USDA_FOODDATA_API_KEY}")
    private String usdaFoodDataApiKey;


    @Override
    public List<FoodEntity> findAllByUserCreatedBy_Id(UUID userId) {
        return foodRepository.findAllByUserCreatedBy_Id(userId);
    }

    @Override
    public FoodEntity findById(UUID foodId) {
        return foodRepository.findById(foodId).orElseThrow();
    }

    @Override
    public List<FoodEntity> getRecentFoods(UUID userId) {
        return foodRepository.findAllByInUserRecents_Id(userId);
    }

    @Override
    public FoodEntity save(FoodEntity foodEntity) {
        if (foodEntity.getId() == null) {
            return foodRepository.save(foodEntity);
        }

        // Updating an existing entity
        return foodRepository.findById(foodEntity.getId())
                .map(existing -> {
                    if (foodEntity.getFoodName() != null) existing.setFoodName(foodEntity.getFoodName());
                    if (foodEntity.getFoodBrandName() != null) existing.setFoodBrandName(foodEntity.getFoodBrandName());
                    if (foodEntity.getFoodBrandOwner() != null) existing.setFoodBrandOwner(foodEntity.getFoodBrandOwner());

                    if (foodEntity.getCalories() != null) existing.setCalories(foodEntity.getCalories());
                    if (foodEntity.getProtein() != null) existing.setProtein(foodEntity.getProtein());
                    if (foodEntity.getCarbohydrates() != null) existing.setCarbohydrates(foodEntity.getCarbohydrates());
                    if (foodEntity.getFat() != null) existing.setFat(foodEntity.getFat());
                    if (foodEntity.getFiber() != null) existing.setFiber(foodEntity.getFiber());
                    if (foodEntity.getSugar() != null) existing.setSugar(foodEntity.getSugar());
                    if (foodEntity.getSaturatedFat() != null) existing.setSaturatedFat(foodEntity.getSaturatedFat());
                    if (foodEntity.getPolyunsaturatedFat() != null) existing.setPolyunsaturatedFat(foodEntity.getPolyunsaturatedFat());
                    if (foodEntity.getMonounsaturatedFat() != null) existing.setMonounsaturatedFat(foodEntity.getMonounsaturatedFat());
                    if (foodEntity.getTransFat() != null) existing.setTransFat(foodEntity.getTransFat());
                    if (foodEntity.getCholesterol() != null) existing.setCholesterol(foodEntity.getCholesterol());
                    if (foodEntity.getSodium() != null) existing.setSodium(foodEntity.getSodium());
                    if (foodEntity.getPotassium() != null) existing.setPotassium(foodEntity.getPotassium());

                    if (foodEntity.getServingSize() != null) existing.setServingSize(foodEntity.getServingSize());
                    if (foodEntity.getServingUnit() != null) existing.setServingUnit(foodEntity.getServingUnit());
                    if (foodEntity.getHouseholdServingText() != null) existing.setHouseholdServingText(foodEntity.getHouseholdServingText());

                    // relations
                    if (foodEntity.getUserCreatedBy() != null) existing.setUserCreatedBy(foodEntity.getUserCreatedBy());
                    if (foodEntity.getMealConnectedTo() != null) existing.setMealConnectedTo(foodEntity.getMealConnectedTo());

                    return foodRepository.save(existing);
                })
                .orElseThrow(() -> new EntityNotFoundException("Food not found with id " + foodEntity.getId()));
    }

    @Override
    public void delete(FoodEntity foodEntity) {
        foodRepository.delete(foodEntity);
    }

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
