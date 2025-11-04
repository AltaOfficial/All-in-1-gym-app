package com.strive.app.services.impl;

import com.strive.app.domain.entities.*;
import com.strive.app.repositories.FoodRepository;
import com.strive.app.repositories.MealPlanRepository;
import com.strive.app.services.FoodLogsService;
import com.strive.app.services.MealPlanService;
import com.strive.app.services.MetricsService;
import com.strive.app.domain.dto.LogFoodRequestDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class MealPlanServiceImpl implements MealPlanService {
    private final MealPlanRepository mealPlanRepository;
    private final FoodRepository foodRepository;
    private final FoodLogsService foodLogsService;
    private final MetricsService metricsService;

    @Override
    public MealPlanEntity findById(MealPlanId id) {
        return mealPlanRepository.findById(id).orElseThrow();
    }

    @Override
    public MealPlanEntity save(MealPlanEntity mealPlanEntity) {
        return mealPlanRepository.save(mealPlanEntity);
    }

    @Override
    @Transactional
    public MealPlanEntity addToMealPlan(MealPlanId mealPlanId, FoodEntity foodEntity) {
        MealPlanEntity mealPlanEntity = mealPlanRepository.findById(mealPlanId)
                .orElse(MealPlanEntity.builder()
                        .id(mealPlanId)
                        .user(UserEntity.builder().id(mealPlanId.getUserId()).build())
                        .build());

        mealPlanEntity.addItem(foodEntity);
        return mealPlanRepository.save(mealPlanEntity);
    }

    @Override
    @Transactional
    public MealPlanEntity removeFromMealPlan(MealPlanId mealPlanId, FoodEntity foodEntity) {
        MealPlanEntity mealPlanEntity = mealPlanRepository.findById(mealPlanId).orElseThrow();

        // Find and remove the item
        mealPlanEntity.getMealPlanItems().removeIf(item -> item.getId().equals(foodEntity.getId()));

        return mealPlanRepository.save(mealPlanEntity);
    }

    @Override
    @Transactional
    public FoodEntity toggleItemLogged(UUID foodId) {
        FoodEntity item = foodRepository.findById(foodId).orElseThrow();

        // Toggle the logged status
        Boolean newLoggedStatus = !item.getIsLogged();
        item.setIsLogged(newLoggedStatus);

        // Get the meal plan date from the parent entity
        MealPlanEntity mealPlan = item.getMealPlanConnectedTo();
        MealPlanId mealPlanId = mealPlan.getId();
        FoodLogId foodLogId = FoodLogId.builder()
                .userId(mealPlanId.getUserId())
                .date(mealPlanId.getDate())
                .build();

        if (newLoggedStatus) {
            // Add to food log
            FoodLogItemEntity foodLogItem = FoodLogItemEntity.builder()
                    .mealType(item.getMealType())
                    .foodName(item.getFoodName())
                    .brandName(item.getFoodBrandName())
                    .calories(item.getCalories())
                    .protein(item.getProtein())
                    .carbs(item.getCarbohydrates())
                    .fat(item.getFat())
                    .time(LocalTime.now())
                    .servingSize(String.valueOf(item.getServingSize()))
                    .servings(Double.valueOf(item.getServingsAmount()))
                    .build();

            foodLogsService.logFood(foodLogId, foodLogItem);

            // Update daily metrics
            LogFoodRequestDto logFoodDto = LogFoodRequestDto.builder()
                    .calories(item.getCalories())
                    .protein(item.getProtein())
                    .carbohydrates(item.getCarbohydrates())
                    .fat(item.getFat())
                    .build();
            metricsService.updateDailyMetricsWithFood(mealPlanId.getUserId(), logFoodDto, mealPlanId.getDate());
        } else {
            // Find and remove from food log
            FoodLogEntity foodLog = foodLogsService.findById(foodLogId);

            // Find matching food log item (by name, meal type, and macros)
            foodLog.getFoodItems().removeIf(logItem ->
                logItem.getFoodName().equals(item.getFoodName()) &&
                logItem.getMealType().equals(item.getMealType()) &&
                logItem.getCalories().equals(item.getCalories()) &&
                logItem.getProtein().equals(item.getProtein()) &&
                logItem.getCarbs().equals(item.getCarbohydrates()) &&
                logItem.getFat().equals(item.getFat())
            );

            foodLogsService.save(foodLog);

            // Update daily metrics - subtract the food
            LogFoodRequestDto subtractFoodDto = LogFoodRequestDto.builder()
                    .calories(-item.getCalories())
                    .protein(-item.getProtein())
                    .carbohydrates(-item.getCarbohydrates())
                    .fat(-item.getFat())
                    .build();
            metricsService.updateDailyMetricsWithFood(mealPlanId.getUserId(), subtractFoodDto, mealPlanId.getDate());
        }

        return foodRepository.save(item);
    }
}
