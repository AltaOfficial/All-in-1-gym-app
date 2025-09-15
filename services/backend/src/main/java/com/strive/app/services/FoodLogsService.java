package com.strive.app.services;

import com.strive.app.domain.dto.LogFoodRequestDto;
import com.strive.app.domain.entities.FoodLogEntity;
import com.strive.app.domain.entities.FoodLogId;
import com.strive.app.domain.entities.FoodLogItemEntity;

import java.util.List;
import java.util.UUID;

public interface FoodLogsService {
    FoodLogEntity findById(FoodLogId id);

    FoodLogEntity save(FoodLogEntity foodLogEntity);

    FoodLogEntity logFood(FoodLogId foodLogId, FoodLogItemEntity foodLogItemEntity);

    FoodLogEntity removeFood(FoodLogId foodLogId, FoodLogItemEntity foodLogItemEntity);

    // Combined method to log food and update metrics in a single transaction
    FoodLogEntity logFoodAndUpdateMetrics(UUID userId, LogFoodRequestDto logFoodRequestDto);
}
