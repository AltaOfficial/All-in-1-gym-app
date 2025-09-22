package com.strive.app.repositories;

import com.strive.app.domain.entities.ExerciseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<ExerciseEntity, UUID> {

    List<ExerciseEntity> findAllByWorkoutConnectedToId(UUID workoutId);
}
