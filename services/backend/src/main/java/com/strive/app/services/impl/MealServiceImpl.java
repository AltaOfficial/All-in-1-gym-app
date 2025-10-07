package com.strive.app.services.impl;

import com.strive.app.domain.entities.MealEntity;
import com.strive.app.domain.entities.MealId;
import com.strive.app.repositories.MealRepository;
import com.strive.app.services.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MealServiceImpl implements MealService {
    private final MealRepository mealRepository;

    @Override
    public MealEntity findById(MealId id) {
        return mealRepository.findById(id).orElseThrow();
    }

    @Override
    public List<MealEntity> findAllByUserId(UUID userId) {
        return mealRepository.findAllByIdUserId(userId);
    }

    @Override
    public MealEntity save(MealEntity mealEntity) {
        return mealRepository.save(mealEntity);
    }

    @Override
    public void deleteMeal(MealId id) {
        mealRepository.deleteById(id);
    }
}
