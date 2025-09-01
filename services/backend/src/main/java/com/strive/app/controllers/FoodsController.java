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
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    // create food

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
    public ResponseEntity<Boolean> logFood(@RequestBody LogFoodRequestDto logFoodRequestDto,
            @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

        foodLogsService.logFoodAndUpdateMetrics(userEntity.getId(), logFoodRequestDto);

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

    // search for user foods

    // search for global foods

    @GetMapping("/search")
    public ResponseEntity<List<FoodDto>> foods(@RequestParam String query) throws IOException, InterruptedException {
        List<FoodEntity> foodEntities = foodsService.search(query);
        return ResponseEntity.ok(foodEntities.stream().map(foodsMapper::mapTo).toList());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<FoodLogItemDto>> getRecentFoods(@RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

        List<FoodLogItemEntity> recentFoods = foodLogsService.getRecentFoods(userEntity.getId());

        return ResponseEntity.ok(recentFoods.stream().map(foodLogItemMapper::mapTo).toList());
    }
}
