package com.strive.app.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.strive.app.enums.MealType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "foodlogitems")
public class FoodLogItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private MealType mealType;

    @ManyToOne
    @JsonIgnore
    private FoodLogEntity foodLogEntity;

    private String foodName;
    private String brandName;

    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;

    private LocalTime time;

    private String servingSize;
    private Double servings;

    public void setFoodLog(FoodLogEntity foodLogEntity) {
        this.foodLogEntity = foodLogEntity;
    }
}
