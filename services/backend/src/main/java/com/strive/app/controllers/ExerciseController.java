package com.strive.app.controllers;

import com.strive.app.domain.dto.ExerciseLogRequestDto;
import com.strive.app.domain.entities.ExerciseLogEntity;
import com.strive.app.domain.entities.ExerciseSet;
import com.strive.app.services.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/exercise")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @PostMapping("/save-set")
    public ResponseEntity<String> saveExerciseSet(@RequestBody ExerciseLogRequestDto request) {
        // Convert DTOs to entities
        List<ExerciseSet> sets = request.getSetsList().stream()
                .map(dto -> ExerciseSet.builder()
                        .repsDone(dto.getRepsDone())
                        .effortType(dto.getEffortType())
                        .weight(dto.getWeight())
                        .restTimeInSeconds(dto.getRestTimeInSeconds())
                        .note(dto.getNote())
                        .build())
                .collect(Collectors.toList());

        // Save or update exercise log
        ExerciseLogEntity savedLog = exerciseService.saveOrUpdateExerciseLog(
                request.getExerciseLogId(),
                request.getWorkoutLogId(),
                request.getExerciseParentId(),
                sets
        );

        // Return the workout log ID
        return ResponseEntity.ok(savedLog.getWorkoutLog().getId().toString());
    }
}
