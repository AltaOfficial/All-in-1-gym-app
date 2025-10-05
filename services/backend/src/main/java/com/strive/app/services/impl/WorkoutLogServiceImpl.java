package com.strive.app.services.impl;

import com.strive.app.domain.entities.UserEntity;
import com.strive.app.domain.entities.WorkoutEntity;
import com.strive.app.domain.entities.WorkoutLogEntity;
import com.strive.app.repositories.UserRepository;
import com.strive.app.repositories.WorkoutLogRepository;
import com.strive.app.repositories.WorkoutRepository;
import com.strive.app.services.WorkoutLogService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkoutLogServiceImpl implements WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;
    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public WorkoutLogEntity createWorkoutLog(Date date, UUID workoutId, UUID userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow();

        WorkoutLogEntity workoutLog = WorkoutLogEntity.builder()
                .date(date)
                .exerciseLogs(new ArrayList<>())
                .user(user)
                .build();

        if (workoutId != null) {
            WorkoutEntity workout = workoutRepository.findById(workoutId).orElse(null);
            workoutLog.setWorkout(workout);
        }

        return workoutLogRepository.save(workoutLog);
    }

    @Override
    public WorkoutLogEntity findById(UUID id) {
        return workoutLogRepository.findById(id).orElseThrow();
    }

    @Override
    public List<WorkoutLogEntity> findAllByWorkoutIdAndUserId(UUID workoutId, UUID userId) {
        return workoutLogRepository.findAllByWorkout_idAndUser_id(workoutId, userId);
    }

    @Override
    public void deleteWorkoutLog(UUID id) {
        workoutLogRepository.deleteById(id);
    }
}
