package com.strive.app.domain.dto;

import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.enums.TrainingExperience;
import com.strive.app.enums.WeightType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private UUID Id;

    private Integer onBoardingStep = 1;

    private Integer age;

    private Integer weight;

    private WeightType weightType;

    private Integer heightInInches;

    private GenderType sexType;

    private TrainingExperience trainingExperience;

    private MainGoal mainGoal;

    private Double weightChangeAmount;

    private String name;

    private String email;

    private String password;

    private List<UUID> recentFoods;

    private Integer goalCalories;

    private Integer goalProtein;
    private Integer goalCarbohydrates;
    private Integer goalFat;

    private Integer goalFiber;
    private Integer goalSugar;
    private Integer goalSaturatedFat;
    private Integer goalPolyunsaturatedFat = 0;
    private Integer goalMonounsaturatedFat = 0;
    private Integer goalTransFat = 0;
    private Integer goalCholesterol;
    private Integer goalSodium;
    private Integer goalPotassium;

    @Builder.Default
    private List<MealDto> meals = new ArrayList<>();

    @Builder.Default
    private List<FoodDto> foods = new ArrayList<>();
}
