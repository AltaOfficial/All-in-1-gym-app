package com.strive.app.controllers;

import com.strive.app.domain.dto.WorkoutLogDto;
import com.strive.app.domain.entities.WorkoutLogEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.WorkoutLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/workout-log")
@RequiredArgsConstructor
public class WorkoutLogController {

    private final WorkoutLogService workoutLogService;
    private final Mapper<WorkoutLogEntity, WorkoutLogDto> workoutLogMapper;

    @PostMapping("/start")
    public ResponseEntity<String> startWorkoutLog(
            @RequestParam(required = false) UUID workoutId) {
        WorkoutLogEntity workoutLog = workoutLogService.createWorkoutLog(new Date(), workoutId);
        return ResponseEntity.ok(workoutLog.getId().toString());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutLogDto> getWorkoutLog(@PathVariable UUID id) {
        WorkoutLogEntity workoutLog = workoutLogService.findById(id);
        return ResponseEntity.ok(workoutLogMapper.mapTo(workoutLog));
    }

    @GetMapping("/history")
    public ResponseEntity<List<WorkoutLogDto>> getWorkoutHistory(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        List<WorkoutLogEntity> workoutLogs = workoutLogService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(workoutLogs.stream().map(workoutLogMapper::mapTo).toList());
    }
}
