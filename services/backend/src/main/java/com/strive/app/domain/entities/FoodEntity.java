package com.strive.app.domain.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "foods")
public class FoodEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @ToString.Exclude
    private UserEntity userCreatedBy;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id")
    @JsonBackReference
    @ToString.Exclude
    private MealEntity mealConnectedTo;

    @Column(nullable = false)
    private String foodName;
    private String foodBrandName;
    private String foodBrandOwner;

    private Double calories;
    private Double protein;
    private Double carbohydrates;
    private Double fat;
    private Double fiber;
    private Double sugar;
    private Double saturatedFat;
    private Double polyunsaturatedFat;
    private Double monounsaturatedFat;
    private Double transFat;
    private Double cholesterol;
    private Double sodium;
    private Double potassium;

    private Double servingSize;
    private String servingUnit;
    private String householdServingText;
}
