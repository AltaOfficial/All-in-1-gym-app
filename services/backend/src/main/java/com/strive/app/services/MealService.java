package com.strive.app.services;

import com.strive.app.domain.entities.MealEntity;
import com.strive.app.domain.entities.MealId;

import java.util.List;
import java.util.UUID;

public interface MealService {
    MealEntity findById(MealId id);
    List<MealEntity> findAllByUserId(UUID userId);
    MealEntity save(MealEntity mealEntity);
    void deleteMeal(MealId id);
}
