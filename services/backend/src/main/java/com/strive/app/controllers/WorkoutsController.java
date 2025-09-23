package com.strive.app.controllers;

import com.strive.app.domain.dto.WorkoutDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.domain.entities.WorkoutEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.ExerciseService;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/workouts")
@RequiredArgsConstructor
public class WorkoutsController {
    private final ExerciseService exerciseService;
    private final UserService userService;
    private final Mapper<WorkoutEntity, WorkoutDto> workoutMapper;
    private final AuthenticationService authenticationService;

    @PostMapping("/create")
    public WorkoutDto createWorkout(@RequestBody WorkoutDto workoutDto, @RequestHeader("Authorization") String jwtToken){
        if(jwtToken.startsWith("Bearer ")){
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
            workoutDto.setUserCreatedById(userEntity.getId());
            System.out.println(workoutDto);
            return workoutMapper.mapTo(exerciseService.saveWorkout(workoutMapper.mapFrom(workoutDto)));
        }
        return null;
    }

    @GetMapping("/all")
    public List<WorkoutDto> getAllWorkouts(@RequestHeader("Authorization") String jwtToken){

        if(jwtToken.startsWith("Bearer ")){
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
            return exerciseService.findAllWorkoutsByUserId(userEntity.getId()).stream().map(workoutMapper::mapTo).toList();
        }
        return null;
    }

    @PostMapping("/update")
    public WorkoutDto updateWorkout(WorkoutDto workoutDto){
        return null;
    }

    @GetMapping("/delete")
    public void deleteWorkout(UUID id){

    }
}
