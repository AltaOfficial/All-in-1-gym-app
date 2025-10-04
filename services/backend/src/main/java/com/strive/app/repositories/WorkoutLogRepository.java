package com.strive.app.repositories;

import com.strive.app.domain.entities.WorkoutLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLogEntity, UUID> {

    List<WorkoutLogEntity> findAllByDateBetween(Date startDate, Date endDate);
}
