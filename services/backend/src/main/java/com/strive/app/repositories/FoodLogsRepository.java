package com.strive.app.repositories;

import com.strive.app.domain.entities.FoodLogEntity;
import com.strive.app.domain.entities.FoodLogId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodLogsRepository extends JpaRepository<FoodLogEntity, FoodLogId> {
}
