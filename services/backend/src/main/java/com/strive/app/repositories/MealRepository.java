package com.strive.app.repositories;

import com.strive.app.domain.entities.MealEntity;
import com.strive.app.domain.entities.MealId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MealRepository extends JpaRepository<MealEntity, MealId> {
    List<MealEntity> findAllByIdUserId(UUID userId);
}
