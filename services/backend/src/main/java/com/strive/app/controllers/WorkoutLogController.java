package com.strive.app.controllers;

import com.strive.app.domain.dto.WorkoutLogDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.domain.entities.WorkoutLogEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.UserService;
import com.strive.app.services.WorkoutLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/start")
    public ResponseEntity<String> startWorkoutLog(
            @RequestParam(required = false) UUID workoutId,
            @RequestHeader(name = "Authorization") String jwtToken) {
        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
            WorkoutLogEntity workoutLog = workoutLogService.createWorkoutLog(new Date(), workoutId, userEntity.getId());
            return ResponseEntity.ok(workoutLog.getId().toString());
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutLogDto> getWorkoutLog(@PathVariable UUID id) {
        WorkoutLogEntity workoutLog = workoutLogService.findById(id);
        return ResponseEntity.ok(workoutLogMapper.mapTo(workoutLog));
    }

    @GetMapping("/history")
    public ResponseEntity<List<WorkoutLogDto>> getWorkoutHistory(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestHeader(name = "Authorization") String jwtToken) {
        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
            List<WorkoutLogEntity> workoutLogs = workoutLogService.findByDateRange(startDate, endDate, userEntity.getId());
            return ResponseEntity.ok(workoutLogs.stream().map(workoutLogMapper::mapTo).toList());
        }
        return ResponseEntity.badRequest().build();
    }
}
