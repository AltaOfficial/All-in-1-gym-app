package com.strive.app.services;

import com.strive.app.domain.dto.LogFoodRequestDto;
import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;

import java.util.UUID;

public interface MetricsService {
    MetricsEntity findOne(MetricsId id);

    // find by id and date range

    MetricsEntity save(MetricsId id, MetricsEntity metricsEntity);

    MetricsEntity save(MetricsEntity metricsEntity);

    // Update daily metrics by adding food macros
    MetricsEntity updateDailyMetricsWithFood(UUID userId, LogFoodRequestDto logFoodRequestDto);
}
