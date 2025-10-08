package com.strive.app.controllers;

import com.strive.app.domain.dto.*;
import com.strive.app.domain.entities.*;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.MealPlanService;
import com.strive.app.services.UserService;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping(path = "/mealplan")
@RequiredArgsConstructor
public class MealPlanController {
    private final MealPlanService mealPlanService;
    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final Mapper<MealPlanEntity, MealPlanDto> mealPlanMapper;
    private final Mapper<FoodEntity, FoodDto> foodMapper;

    @PostMapping
    public ResponseEntity<MealPlanDto> getMealPlan(
            @RequestBody MealPlanRequestDto mealPlanRequestDto,
            @RequestHeader("Authorization") String jwtToken) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            MealPlanId mealPlanId = MealPlanId.builder()
                    .userId(userEntity.getId())
                    .date(mealPlanRequestDto.getDate())
                    .build();

            try {
                MealPlanEntity mealPlanEntity = mealPlanService.findById(mealPlanId);
                MealPlanDto responseDto = mealPlanMapper.mapTo(mealPlanEntity);
                return ResponseEntity.ok(responseDto);
            } catch (NoSuchElementException exception) {
                // Return empty meal plan
                MealPlanDto emptyPlan = MealPlanDto.builder()
                        .id(mealPlanId)
                        .userId(userEntity.getId())
                        .build();
                return ResponseEntity.ok(emptyPlan);
            }
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping(path = "/add")
    public ResponseEntity<MealPlanDto> addToMealPlan(
            @RequestBody MealPlanRequestDto mealPlanRequestDto,
            @RequestHeader("Authorization") String jwtToken) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            MealPlanId mealPlanId = MealPlanId.builder()
                    .userId(userEntity.getId())
                    .date(mealPlanRequestDto.getDate())
                    .build();

            FoodEntity itemEntity = foodMapper.mapFrom(
                    mealPlanRequestDto.getMealPlanItemDto()
            );

            MealPlanEntity mealPlanEntity = mealPlanService.addToMealPlan(mealPlanId, itemEntity);
            MealPlanDto responseDto = mealPlanMapper.mapTo(mealPlanEntity);
            return ResponseEntity.ok(responseDto);
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping(path = "/remove")
    public ResponseEntity<MealPlanDto> removeFromMealPlan(
            @RequestBody MealPlanRequestDto mealPlanRequestDto,
            @RequestHeader("Authorization") String jwtToken) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            MealPlanId mealPlanId = MealPlanId.builder()
                    .userId(userEntity.getId())
                    .date(mealPlanRequestDto.getDate())
                    .build();

            try {
                MealPlanEntity mealPlanEntity = mealPlanService.removeFromMealPlan(
                        mealPlanId,
                        foodMapper.mapFrom(mealPlanRequestDto.getMealPlanItemDto())
                );
                MealPlanDto responseDto = mealPlanMapper.mapTo(mealPlanEntity);
                return ResponseEntity.ok(responseDto);
            } catch (NoSuchElementException exception) {
                return ResponseEntity.notFound().build();
            }
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping(path = "/toggle")
    public ResponseEntity<FoodDto> toggleItemLogged(
            @RequestBody MealPlanRequestDto mealPlanRequestDto,
            @RequestHeader("Authorization") String jwtToken) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            userService.findByEmail(userDetails.getUsername());

            try {
                FoodEntity updatedItem = mealPlanService.toggleItemLogged(
                        mealPlanRequestDto.getFoodId()
                );
                FoodDto responseDto = foodMapper.mapTo(updatedItem);
                return ResponseEntity.ok(responseDto);
            } catch (NoSuchElementException exception) {
                return ResponseEntity.notFound().build();
            }
        }

        return ResponseEntity.badRequest().build();
    }
}
