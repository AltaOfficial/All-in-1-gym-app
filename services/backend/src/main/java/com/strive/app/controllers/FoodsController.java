package com.strive.app.controllers;

import com.strive.app.domain.dto.FoodDto;
import com.strive.app.domain.dto.FoodLogItemDto;
import com.strive.app.domain.dto.GetFoodLogRequestDto;
import com.strive.app.domain.dto.LogFoodRequestDto;
import com.strive.app.domain.entities.*;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.FoodLogsService;
import com.strive.app.services.FoodsService;
import com.strive.app.services.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/foods")
@RequiredArgsConstructor
public class FoodsController {
    private final FoodsService foodsService;
    private final Mapper<FoodEntity, FoodDto> foodsMapper;
    private final Mapper<FoodLogItemEntity, FoodLogItemDto> foodLogItemMapper;
    private final AuthenticationService authenticationService;
    private final FoodLogsService foodLogsService;
    private final UserService userService;

    // create a meal

    // search for user meals

    // remove food from the food log
    @PostMapping("/removelogfood")
    public ResponseEntity<Boolean> removeLogFood(@RequestBody LogFoodRequestDto logFoodRequestDto,
            @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        FoodLogItemEntity foodLogItemEntity = FoodLogItemEntity.builder()
                .foodName(logFoodRequestDto.getFoodName())
                .brandName(logFoodRequestDto.getBrandName())
                .fat(logFoodRequestDto.getFat())
                .carbs(logFoodRequestDto.getCarbohydrates())
                .protein(logFoodRequestDto.getProtein())
                .time(logFoodRequestDto.getTime())
                .calories(logFoodRequestDto.getCalories())
                .servingSize(logFoodRequestDto.getServingSize())
                .mealType(logFoodRequestDto.getMealType())
                .servings(logFoodRequestDto.getServings())
                .build();
        foodLogsService.logFood(FoodLogId.builder().userId(userEntity.getId()).build(), foodLogItemEntity);
        return ResponseEntity.ok(null);
    }

    // add food to the food log
    @PostMapping("/logfood")
    @Transactional
    public ResponseEntity<Boolean> logFood(@RequestBody LogFoodRequestDto logFoodRequestDto,
            @RequestHeader("Authorization") String jwtToken, @RequestHeader("Date") LocalDate date) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        FoodEntity foodEntity = FoodEntity.builder()
                .foodName(logFoodRequestDto.getFoodName())
                .foodBrandName(logFoodRequestDto.getBrandName())
                .calories(logFoodRequestDto.getCalories())
                .protein(logFoodRequestDto.getProtein())
                .carbohydrates(logFoodRequestDto.getCarbohydrates())
                .fat(logFoodRequestDto.getFat())
                .fiber(logFoodRequestDto.getFiber())
                .sugar(logFoodRequestDto.getSugar())
                .saturatedFat(logFoodRequestDto.getSaturatedFat())
                .polyunsaturatedFat(logFoodRequestDto.getPolyunsaturatedFat())
                .monounsaturatedFat(logFoodRequestDto.getMonounsaturatedFat())
                .transFat(logFoodRequestDto.getTransFat())
                .cholesterol(logFoodRequestDto.getCholesterol())
                .sodium(logFoodRequestDto.getSodium())
                .potassium(logFoodRequestDto.getPotassium())
                .servingSize(logFoodRequestDto.getServings())
                .servingsAmount(logFoodRequestDto.getServings() != null
                        ? logFoodRequestDto.getServings().intValue()
                        : null)
                .servingUnit(logFoodRequestDto.getServingSize())
                .build();

        foodLogsService.logFoodAndUpdateMetrics(userEntity.getId(), logFoodRequestDto, date);
        userService.addToRecentFoods(foodEntity, userEntity);

        return ResponseEntity.ok(true);
    }

    @PostMapping("/foodlog/date")
    public ResponseEntity<List<FoodLogItemDto>> getFoodLog(@RequestBody GetFoodLogRequestDto getFoodLogRequestDto,
            @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        if (getFoodLogRequestDto.getDate() == null) {
            return null;
        }
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        try {
            FoodLogEntity foodLogEntity = foodLogsService.findById(
                    FoodLogId.builder().userId(userEntity.getId()).date(getFoodLogRequestDto.getDate()).build());
            return ResponseEntity.ok(foodLogEntity.getFoodItems().stream().map(foodLogItemMapper::mapTo).toList());
        } catch (NoSuchElementException exception) {
            FoodLogEntity foodLogEntity = foodLogsService.save(FoodLogEntity.builder().user(userEntity)
                    .id(FoodLogId.builder().userId(userEntity.getId()).date(getFoodLogRequestDto.getDate()).build())
                    .build());
            return ResponseEntity.ok(foodLogEntity.getFoodItems().stream().map(foodLogItemMapper::mapTo).toList());
        }
    }

    @PostMapping("/updateuserfood")
    public void updateUserFood(@RequestBody FoodDto foodDto) {

    }

    // get all user foods
    @GetMapping("/userfoods")
    public ResponseEntity<List<FoodDto>> userFoods(@RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(foodsService.findAllByUserCreatedBy_Id(userEntity.getId()).stream()
                .map(foodsMapper::mapTo).toList());
    }

    // create user food
    @PostMapping("/createfood")
    public ResponseEntity<FoodDto> createFood(@RequestHeader("Authorization") String jwtToken, @RequestBody FoodDto foodDto) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        foodDto.setUserCreatedById(userEntity.getId());
        return ResponseEntity.ok(foodsMapper.mapTo(foodsService.save(foodsMapper.mapFrom(foodDto))));
    }

    // search for global foods

    @GetMapping("/search")
    public ResponseEntity<List<FoodDto>> foods(@RequestParam String query) throws IOException, InterruptedException {
        List<FoodEntity> foodEntities = foodsService.search(query);
        return ResponseEntity.ok(foodEntities.stream().map(foodsMapper::mapTo).toList());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<FoodDto>> getRecentFoods(@RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

        List<FoodEntity> recentFoods = foodsService.getRecentFoods(userEntity.getId());

        return ResponseEntity.ok(recentFoods.stream().map(foodsMapper::mapTo).toList());
    }
}
