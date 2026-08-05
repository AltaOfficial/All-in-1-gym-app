package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.WorkoutDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.domain.entities.WorkoutEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.BlobService;
import com.strive.app.services.ExerciseService;
import com.strive.app.services.UserService;
import io.modelcontextprotocol.common.McpTransportContext;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class WorkoutTools {
    private final ExerciseService exerciseService;
    private final UserService userService;
    private final Mapper<WorkoutEntity, WorkoutDto> workoutMapper;

    @McpTool(name = "getAllWorkouts", description = "Get all of current users ")
    public List<WorkoutDto> getAllWorkouts() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String sub = jwt.getSubject();

        UserEntity userEntity = userService.findByEmail(sub);
        List<WorkoutDto> workoutDtos = exerciseService.findAllWorkoutsByUserId(userEntity.getId()).stream().map(workoutMapper::mapTo).toList();
        System.out.println(workoutDtos);
        return workoutDtos;
    }



}
