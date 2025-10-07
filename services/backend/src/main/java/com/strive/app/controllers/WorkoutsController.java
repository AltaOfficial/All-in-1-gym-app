package com.strive.app.controllers;

import com.strive.app.domain.dto.WorkoutDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.domain.entities.WorkoutEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.ExerciseService;
import com.strive.app.services.UserService;
import com.strive.app.services.BlobService;
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
    private final BlobService blobService;

    @PostMapping("/create")
    public WorkoutDto createWorkout(@RequestBody WorkoutDto workoutDto, @RequestHeader("Authorization") String jwtToken){
        if(jwtToken.startsWith("Bearer ")){
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
            workoutDto.setUserCreatedById(userEntity.getId());

            // Process exercise images through BlobService
            if (workoutDto.getExercises() != null) {
                workoutDto.getExercises().forEach(exercise -> {
                    if (exercise.getExerciseImageFileName() != null &&
                        exercise.getExerciseImageBase64() != null &&
                        exercise.getExerciseImageMimeType() != null) {
                        String imageUrl = blobService.getBlobUrl(
                            exercise.getExerciseImageFileName(),
                            exercise.getExerciseImageBase64(),
                            exercise.getExerciseImageMimeType()
                        );
                        try {
                            exercise.setExerciseImageUrl(new java.net.URL(imageUrl));
                        } catch (java.net.MalformedURLException e) {
                            // Log error but continue processing
                            System.err.println("Invalid image URL generated: " + imageUrl);
                        }
                    }
                });
            }

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
    public WorkoutDto updateWorkout(@RequestBody WorkoutDto workoutDto){
        // Process exercise images through BlobService
        if (workoutDto.getExercises() != null) {
            workoutDto.getExercises().forEach(exercise -> {
                if (exercise.getExerciseImageFileName() != null &&
                    exercise.getExerciseImageBase64() != null &&
                    exercise.getExerciseImageMimeType() != null) {
                    String imageUrl = blobService.getBlobUrl(
                        exercise.getExerciseImageFileName(),
                        exercise.getExerciseImageBase64(),
                        exercise.getExerciseImageMimeType()
                    );
                    System.out.println(imageUrl);
                    try {
                        exercise.setExerciseImageUrl(new java.net.URL(imageUrl));
                    } catch (java.net.MalformedURLException e) {
                        // Log error but continue processing
                        System.err.println("Invalid image URL generated: " + imageUrl);
                    }
                }
            });
        }

        return workoutMapper.mapTo(exerciseService.updateWorkout(workoutMapper.mapFrom(workoutDto)));
    }

    @GetMapping("/delete/{id}")
    public void deleteWorkout(@PathVariable("id") UUID id){
        exerciseService.deleteWorkout(id);
    }
}
