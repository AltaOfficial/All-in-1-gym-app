package com.strive.app.controllers;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.domain.dto.SettingsUpdateRequestDto;
import com.strive.app.domain.dto.UserDto;
import com.strive.app.domain.entities.FoodLogEntity;
import com.strive.app.domain.entities.FoodLogId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.mappers.NutrientGoalsMapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.FoodLogsService;
import com.strive.app.services.MetricsService;
import com.strive.app.services.NutrientsService;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path = "/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final Mapper<UserEntity, UserDto> userMapper;
    private final AuthenticationService authenticationService;
    private final FoodLogsService foodLogsService;
    private final NutrientsService nutrientsService;
    private final NutrientGoalsMapper nutrientGoalsMapper;
    private final MetricsService metricsService;

    @PostMapping(path = "/create")
    public UserDto createUser(@RequestBody UserDto user) {
        UserEntity newUserEntity = userMapper.mapFrom(user);
        UserEntity savedUserEntity = userService.save(newUserEntity);
        return userMapper.mapTo(savedUserEntity);
    }

    @PostMapping(path = "/update/{id}")
    public UserDto updateUser(@RequestBody UserDto userDto, @PathVariable("id") UUID id) {

        if(!userService.isExists(id)){
            return null;
        }

        return userMapper.mapTo(userService.save(id, userMapper.mapFrom(userDto)));
    }

    @GetMapping(path = "/{id}")
    public Optional<UserDto> getUser(@PathVariable("id") UUID id){
        Optional<UserEntity> foundUserEntity = userService.findOne(id);

        return foundUserEntity.map(userMapper::mapTo);
    }

    @GetMapping(path = "/me")
    public ResponseEntity<UserDto> getUserByJwt(@RequestHeader(name = "Authorization") String jwtToken, @RequestHeader("Date") LocalDate date){
        if(jwtToken.startsWith("Bearer ")){
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
            UserDto userDto = userMapper.mapTo(userService.findByEmail(userDetails.getUsername()));
            userDto.setPassword(null);

            // making sure a food log exists for today
            try {
                foodLogsService.findById(
                        FoodLogId.builder().userId(userEntity.getId()).date(date).build());
            } catch (NoSuchElementException exception) {
                foodLogsService.save(FoodLogEntity.builder().user(userEntity)
                        .id(FoodLogId.builder().userId(userEntity.getId()).date(date).build())
                        .build());
            }
            return ResponseEntity.ok(userDto);
        }
        return null;
    }

    @PostMapping(path = "/settings")
    public ResponseEntity<String> updateSettings(
            @RequestBody SettingsUpdateRequestDto settingsUpdateRequestDto,
            @RequestHeader(name = "Authorization") String jwtToken) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            // Update user fields if provided
            if (settingsUpdateRequestDto.getMainGoal() != null) {
                userEntity.setMainGoal(settingsUpdateRequestDto.getMainGoal());
            }
            if (settingsUpdateRequestDto.getWeight() != null) {
                userEntity.setWeight(settingsUpdateRequestDto.getWeight());
            }
            if (settingsUpdateRequestDto.getHeightInInches() != null) {
                userEntity.setHeightInInches(settingsUpdateRequestDto.getHeightInInches());
            }
            if (settingsUpdateRequestDto.getAge() != null) {
                userEntity.setAge(settingsUpdateRequestDto.getAge());
            }

            // Recalculate nutrient goals with existing and new data
            NutrientGoalsDto nutrientGoalsDto = nutrientsService.calculateNutrientGoals(
                    userEntity.getAge(),
                    userEntity.getWeight(),
                    userEntity.getWeightType(),
                    userEntity.getSexType(),
                    userEntity.getHeightInInches(),
                    userEntity.getWeightChangeAmount(),
                    userEntity.getMainGoal(),
                    userEntity.getTrainingExperience()
            );

            // Update user with new nutrient goals
            nutrientGoalsMapper.updateUserWithGoals(nutrientGoalsDto, userEntity);

            // Save the updated user
            userService.save(userEntity);

            // Update today's metrics goals
            metricsService.updateTodaysGoals(userEntity.getId(), nutrientGoalsDto);

            return new ResponseEntity<>("Settings updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    }
}
