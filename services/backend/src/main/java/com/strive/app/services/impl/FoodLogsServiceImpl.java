package com.strive.app.services.impl;

import com.strive.app.domain.dto.LogFoodRequestDto;
import com.strive.app.domain.entities.FoodLogEntity;
import com.strive.app.domain.entities.FoodLogId;
import com.strive.app.domain.entities.FoodLogItemEntity;
import com.strive.app.repositories.FoodLogsRepository;
import com.strive.app.services.FoodLogsService;
import com.strive.app.services.MetricsService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FoodLogsServiceImpl implements FoodLogsService {
    private final FoodLogsRepository foodLogsRepository;
    private final MetricsService metricsService;

    @Override
    public FoodLogEntity findById(FoodLogId id) {
        return foodLogsRepository.findById(id).orElseThrow();
    }

    @Override
    public FoodLogEntity save(FoodLogEntity foodLogEntity) {
        return foodLogsRepository.save(foodLogEntity);
    }

    @Override
    @Transactional
    public FoodLogEntity logFood(FoodLogId foodLogId, FoodLogItemEntity foodLogItemEntity) {
        FoodLogEntity foodLogEntity = foodLogsRepository.findById(foodLogId).orElseThrow();
        foodLogEntity.addItem(foodLogItemEntity);
        System.out.println("FoodLogEntity: " + foodLogEntity);
        return foodLogEntity;
    }

    @Override
    @Transactional
    public FoodLogEntity removeFood(FoodLogId foodLogId, FoodLogItemEntity foodLogItemEntity) {
        FoodLogEntity foodLogEntity = foodLogsRepository.findById(foodLogId).orElseThrow();
        foodLogEntity.removeItem(foodLogItemEntity);
        return foodLogEntity;
    }

    @Override
    @Transactional
    public FoodLogEntity logFoodAndUpdateMetrics(UUID userId, LogFoodRequestDto logFoodRequestDto, LocalDate date) {
        // Create FoodLogItemEntity from the DTO
        FoodLogItemEntity foodLogItemEntity = FoodLogItemEntity.builder()
                .foodName(logFoodRequestDto.getFoodName())
                .brandName(logFoodRequestDto.getBrandName())
                .fat(logFoodRequestDto.getFat())
                .carbs(logFoodRequestDto.getCarbohydrates())
                .protein(logFoodRequestDto.getProtein())
                .time(logFoodRequestDto.getTime())
                .calories(logFoodRequestDto.getCalories())
                .servingSize(logFoodRequestDto.getServingSize())
                .mealType(logFoodRequestDto.getMealType())
                .servings(logFoodRequestDto.getServings())
                .build();

        // Log the food
        FoodLogEntity foodLogEntity = logFood(FoodLogId.builder().userId(userId).date(date).build(), foodLogItemEntity);
        System.out.println("FoodLogItemEntity: " + foodLogItemEntity);

        // Update metrics for the specified date
        metricsService.updateDailyMetricsWithFood(userId, logFoodRequestDto, date);

        return foodLogEntity;
    }
}
