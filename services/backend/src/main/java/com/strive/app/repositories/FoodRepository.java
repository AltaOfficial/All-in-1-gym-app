package com.strive.app.repositories;

import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.FoodLogId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FoodRepository extends JpaRepository<FoodEntity, UUID> {
    List<FoodEntity> findAllByUserCreatedBy_Id(UUID id);
    List<FoodEntity> findAllByInUserRecents_Id(UUID id);
    FoodEntity findByFoodNameAndFoodBrandNameAndInUserRecents_Id(String foodName, String foodBrandName, UUID id);
}
