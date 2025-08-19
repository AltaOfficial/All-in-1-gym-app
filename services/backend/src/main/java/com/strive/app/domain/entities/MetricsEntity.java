package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "metrics", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "day"}))
public class MetricsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity user;

    private String currentDay = new Date().toString();

    private int currentCalories;
    private int goalCalories;
    private int burnedCalories;

    private int protein;
    private int goalProtein;

    private int carbohydrates;
    private int goalCarbohydrates;

    private int fat;
    private int goalFat;

    private int fiber;
    private int goalFiber;

    private int sugar;
    private int goalSugar;

    private int saturatedFat;
    private int goalSaturatedFat;

    private int polyunsaturatedFat;
    private int goalPolyunsaturatedFat;

    private int monounsaturatedFat;
    private int goalMonounsaturatedFat;

    private int transFat;
    private int goalTransFat;

    private int cholesterol;
    private int goalCholesterol;

    private int sodium;
    private int goalSodium;

    private int potassium;
    private int goalPotassium;
}
