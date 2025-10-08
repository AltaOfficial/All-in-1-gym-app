package com.strive.app.repositories;

import com.strive.app.domain.entities.WorkoutLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLogEntity, UUID> {

    List<WorkoutLogEntity> findAllByWorkout_idAndUser_id(UUID workoutId, UUID userId);
}
