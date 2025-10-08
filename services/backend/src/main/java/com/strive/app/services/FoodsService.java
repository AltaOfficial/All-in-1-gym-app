package com.strive.app.services;

import com.strive.app.domain.entities.FoodEntity;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface FoodsService {
    List<FoodEntity> findAllByUserCreatedBy_Id(UUID userId);
    FoodEntity findById(UUID foodId);
    List<FoodEntity> getRecentFoods(UUID userId);

    FoodEntity save(FoodEntity foodEntity);
    void delete(FoodEntity foodEntity);

    List<FoodEntity> search(String query) throws IOException, InterruptedException;
}
