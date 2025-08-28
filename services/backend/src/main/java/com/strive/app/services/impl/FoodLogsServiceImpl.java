package com.strive.app.services.impl;

import com.strive.app.domain.entities.FoodLogEntity;
import com.strive.app.domain.entities.FoodLogId;
import com.strive.app.domain.entities.FoodLogItemEntity;
import com.strive.app.repositories.FoodLogsRepository;
import com.strive.app.services.FoodLogsService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FoodLogsServiceImpl implements FoodLogsService {
    private final FoodLogsRepository foodLogsRepository;

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
        return foodLogEntity;
    }

    @Override
    @Transactional
    public FoodLogEntity removeFood(FoodLogId foodLogId, FoodLogItemEntity foodLogItemEntity) {
        FoodLogEntity foodLogEntity = foodLogsRepository.findById(foodLogId).orElseThrow();
        foodLogEntity.removeItem(foodLogItemEntity);
        return foodLogEntity;
    }
}
