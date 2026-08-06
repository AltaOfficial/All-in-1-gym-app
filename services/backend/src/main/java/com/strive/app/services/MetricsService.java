package com.strive.app.services;

import com.strive.app.domain.dto.LogFoodRequestDto;
import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface MetricsService {
    MetricsEntity findOne(MetricsId id);

    List<MetricsEntity> findAllByUserIdAndDateRange(UUID userId, LocalDate startDate, LocalDate endDate);

    MetricsEntity save(MetricsId id, MetricsEntity metricsEntity);

    MetricsEntity save(MetricsEntity metricsEntity);

    // Update daily metrics by adding food macros
    MetricsEntity updateDailyMetricsWithFood(UUID userId, LogFoodRequestDto logFoodRequestDto, LocalDate date);

    // Update today's metrics goals
    void updateTodaysGoals(UUID userId, NutrientGoalsDto nutrientGoalsDto);
}
