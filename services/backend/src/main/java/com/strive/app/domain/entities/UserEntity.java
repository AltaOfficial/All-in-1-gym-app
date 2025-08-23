package com.strive.app.domain.entities;

import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.enums.TrainingExperience;
import com.strive.app.enums.WeightType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private Integer onBoardingStep = 1;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private Integer weight;

    private Integer age;

    private WeightType weightType;

    private Integer heightInInches;

    private GenderType sexType;

    private TrainingExperience trainingExperience;

    private MainGoal mainGoal;

    private Double weightChangeAmount;

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
}
