package com.strive.app.services.impl;

import com.strive.app.domain.dto.LogFoodRequestDto;
import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;
import com.strive.app.repositories.MetricsRepository;
import com.strive.app.services.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class MetricsServiceImpl implements MetricsService {
    private final MetricsRepository metricsRepository;

    @Override
    public MetricsEntity findOne(MetricsId id) {
        System.out.println(id);
        return metricsRepository.findById(id).orElseThrow();
    }

    @Override
    public MetricsEntity save(MetricsId id, MetricsEntity metricsEntity) {
        return null;
    }

    @Override
    public MetricsEntity save(MetricsEntity metricsEntity) {
        return metricsRepository.save(metricsEntity);
    }

    @Override
    public MetricsEntity updateDailyMetricsWithFood(UUID userId, LogFoodRequestDto logFoodRequestDto, LocalDate date) {
        MetricsId metricsId = MetricsId.builder()
                .userId(userId)
                .date(date)
                .build();

        // Find existing metrics for the specified date, throw exception if not found
        MetricsEntity metricsEntity = findOne(metricsId);

        // Add the food macros to current values (frontend already calculated servings)
        // Handle null values by initializing to 0 if null
        metricsEntity.setCurrentCalories(
                (metricsEntity.getCurrentCalories() != null ? metricsEntity.getCurrentCalories() : 0) +
                        (int) Math
                                .round(logFoodRequestDto.getCalories() != null ? logFoodRequestDto.getCalories() : 0));
        metricsEntity.setProtein((metricsEntity.getProtein() != null ? metricsEntity.getProtein() : 0) +
                (int) Math.round(logFoodRequestDto.getProtein() != null ? logFoodRequestDto.getProtein() : 0));
        metricsEntity.setCarbohydrates((metricsEntity.getCarbohydrates() != null ? metricsEntity.getCarbohydrates() : 0) +
                (int) Math.round(logFoodRequestDto.getCarbohydrates() != null ? logFoodRequestDto.getCarbohydrates() : 0));
        metricsEntity.setFat((metricsEntity.getFat() != null ? metricsEntity.getFat() : 0) +
                (int) Math.round(logFoodRequestDto.getFat() != null ? logFoodRequestDto.getFat() : 0));
        metricsEntity.setFiber((metricsEntity.getFiber() != null ? metricsEntity.getFiber() : 0) +
                (int) Math.round(logFoodRequestDto.getFiber() != null ? logFoodRequestDto.getFiber() : 0));
        metricsEntity.setSugar((metricsEntity.getSugar() != null ? metricsEntity.getSugar() : 0) +
                (int) Math.round(logFoodRequestDto.getSugar() != null ? logFoodRequestDto.getSugar() : 0));
        metricsEntity.setSaturatedFat((metricsEntity.getSaturatedFat() != null ? metricsEntity.getSaturatedFat() : 0) +
                (int) Math.round(logFoodRequestDto.getSaturatedFat() != null ? logFoodRequestDto.getSaturatedFat() : 0));
        metricsEntity.setPolyunsaturatedFat(
                (metricsEntity.getPolyunsaturatedFat() != null ? metricsEntity.getPolyunsaturatedFat() : 0) +
                        (int) Math.round(logFoodRequestDto.getPolyunsaturatedFat() != null
                                        ? logFoodRequestDto.getPolyunsaturatedFat()
                                        : 0));
        metricsEntity.setMonounsaturatedFat((metricsEntity.getMonounsaturatedFat() != null ? metricsEntity.getMonounsaturatedFat() : 0) +
                        (int) Math.round(
                                logFoodRequestDto.getMonounsaturatedFat() != null
                                        ? logFoodRequestDto.getMonounsaturatedFat()
                                        : 0));
        metricsEntity.setTransFat((metricsEntity.getTransFat() != null ? metricsEntity.getTransFat() : 0) +
                (int) Math.round(logFoodRequestDto.getTransFat() != null ? logFoodRequestDto.getTransFat() : 0));
        metricsEntity.setCholesterol((metricsEntity.getCholesterol() != null ? metricsEntity.getCholesterol() : 0) +
                (int) Math.round(logFoodRequestDto.getCholesterol() != null ? logFoodRequestDto.getCholesterol() : 0));
        metricsEntity.setSodium((metricsEntity.getSodium() != null ? metricsEntity.getSodium() : 0) +
                (int) Math.round(logFoodRequestDto.getSodium() != null ? logFoodRequestDto.getSodium() : 0));
        metricsEntity.setPotassium((metricsEntity.getPotassium() != null ? metricsEntity.getPotassium() : 0) +
                (int) Math.round(logFoodRequestDto.getPotassium() != null ? logFoodRequestDto.getPotassium() : 0));

        return save(metricsEntity);
    }

    @Override
    public void updateTodaysGoals(UUID userId, NutrientGoalsDto nutrientGoalsDto) {
        MetricsId metricsId = MetricsId.builder()
                .userId(userId)
                .date(LocalDate.now())
                .build();

        try {
            MetricsEntity metricsEntity = findOne(metricsId);

            // Update goal values
            metricsEntity.setGoalCalories(nutrientGoalsDto.getGoalCalories());
            metricsEntity.setGoalProtein(nutrientGoalsDto.getGoalProtein());
            metricsEntity.setGoalCarbohydrates(nutrientGoalsDto.getGoalCarbohydrates());
            metricsEntity.setGoalFat(nutrientGoalsDto.getGoalFat());
            metricsEntity.setGoalFiber(nutrientGoalsDto.getGoalFiber());
            metricsEntity.setGoalSugar(nutrientGoalsDto.getGoalSugar());
            metricsEntity.setGoalSaturatedFat(nutrientGoalsDto.getGoalSaturatedFat());
            metricsEntity.setGoalCholesterol(nutrientGoalsDto.getGoalCholesterol());
            metricsEntity.setGoalSodium(nutrientGoalsDto.getGoalSodium());
            metricsEntity.setGoalPotassium(nutrientGoalsDto.getGoalPotassium());

            save(metricsEntity);
        } catch (Exception e) {
            // If metrics doesn't exist for today, do nothing
        }
    }
}
