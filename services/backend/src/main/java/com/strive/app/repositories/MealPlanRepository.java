package com.strive.app.repositories;

import com.strive.app.domain.entities.MealPlanEntity;
import com.strive.app.domain.entities.MealPlanId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlanEntity, MealPlanId> {
}
