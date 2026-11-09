package com.strive.app.controllers;

import com.strive.app.domain.dto.SettingsUpdateRequestDto;
import com.strive.app.domain.dto.UserDto;
import com.strive.app.domain.entities.FoodLogEntity;
import com.strive.app.domain.entities.FoodLogId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.enums.MainGoal;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.FoodLogsService;
import com.strive.app.services.NutrientsService;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path = "/users")
@RequiredArgsConstructor
public class UserController {

    // Same choices the app offers during onboarding (lbs or kg per week, in the user's unit)
    private static final double DEFAULT_WEEKLY_CHANGE = 0.5;
    private static final double MAX_WEEKLY_CHANGE = 1.0;
    private static final int MAX_CUSTOM_CALORIES = 6000;

    private final UserService userService;
    private final Mapper<UserEntity, UserDto> userMapper;
    private final AuthenticationService authenticationService;
    private final FoodLogsService foodLogsService;
    private final NutrientsService nutrientsService;

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
            Double weeklyChange = settingsUpdateRequestDto.getWeightChangeAmount();
            if (weeklyChange != null && (weeklyChange <= 0 || weeklyChange > MAX_WEEKLY_CHANGE)) {
                return new ResponseEntity<>(
                        "weightChangeAmount must be above 0 and at most " + MAX_WEEKLY_CHANGE,
                        HttpStatus.BAD_REQUEST);
            }

            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            Integer customCalories = settingsUpdateRequestDto.getCustomCalorieGoal();
            int minCalories = NutrientsService.minimumCalories(userEntity.getSexType());
            if (customCalories != null && customCalories != 0
                    && (customCalories < minCalories || customCalories > MAX_CUSTOM_CALORIES)) {
                return new ResponseEntity<>(
                        "customCalorieGoal must be between " + minCalories + " and " + MAX_CUSTOM_CALORIES,
                        HttpStatus.BAD_REQUEST);
            }

            MainGoal previousGoal = userEntity.getMainGoal();
            Double previousWeeklyChange = userEntity.getWeightChangeAmount();
            Integer previousCustomCalories = userEntity.getCustomCalorieGoal();

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

            if (customCalories != null) {
                userEntity.setCustomCalorieGoal(customCalories == 0 ? null : customCalories);
            }

            updateWeeklyChange(userEntity, previousGoal, weeklyChange);

            // Recalculate from the user's recent logs, so a calorie estimate learned from
            // their logs isn't replaced by the generic formula. Unless the user changed what
            // they're aiming for, move calories gradually like the scheduler does, so editing
            // something like their age can't swing the goal by hundreds of calories.
            boolean planChanged = userEntity.getMainGoal() != previousGoal
                    || !Objects.equals(userEntity.getWeightChangeAmount(), previousWeeklyChange)
                    || !Objects.equals(userEntity.getCustomCalorieGoal(), previousCustomCalories);
            nutrientsService.recalculate(userEntity, !planChanged);
            userService.save(userEntity);

            return new ResponseEntity<>("Settings updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * A weekly rate belongs to the goal it was picked for. Maintain has none, and when the goal
     * changes without a new rate, reset to the default instead of carrying the old one over
     * (otherwise "lose 1 kg/week" would quietly become "gain 1 kg/week").
     */
    private static void updateWeeklyChange(UserEntity user, MainGoal previousGoal, Double requestedChange) {
        if (user.getMainGoal() == MainGoal.MAINTAIN) {
            user.setWeightChangeAmount(null);
        } else if (requestedChange != null) {
            user.setWeightChangeAmount(requestedChange);
        } else if (user.getMainGoal() != previousGoal || user.getWeightChangeAmount() == null) {
            user.setWeightChangeAmount(DEFAULT_WEEKLY_CHANGE);
        }
    }
}
