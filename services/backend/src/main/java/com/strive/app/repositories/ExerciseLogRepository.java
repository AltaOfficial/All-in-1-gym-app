package com.strive.app.repositories;

import com.strive.app.domain.entities.ExerciseLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseLogRepository extends JpaRepository<ExerciseLogEntity, UUID> {

    List<ExerciseLogEntity> findAllByExerciseParentWorkoutConnectedToId(UUID workoutId);
}
