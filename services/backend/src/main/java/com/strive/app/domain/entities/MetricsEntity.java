package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "metrics")
public class MetricsEntity {

    @EmbeddedId
    private MetricsId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    private Integer currentCalories;
    private Integer goalCalories;
    private Integer burnedCalories;

    private Integer protein;
    private Integer goalProtein;

    private Integer carbohydrates;
    private Integer goalCarbohydrates;

    private Integer fat;
    private Integer goalFat;

    private Integer fiber;
    private Integer goalFiber;

    private Integer sugar;
    private Integer goalSugar;

    private Integer saturatedFat;
    private Integer goalSaturatedFat;

    private Integer polyunsaturatedFat;
    @Builder.Default
    private Integer goalPolyunsaturatedFat = 0;

    private Integer monounsaturatedFat;
    @Builder.Default
    private Integer goalMonounsaturatedFat = 0;

    private Integer transFat;
    @Builder.Default
    private Integer goalTransFat = 0;

    private Integer cholesterol;
    private Integer goalCholesterol;

    private Integer sodium;
    private Integer goalSodium;

    private Integer potassium;
    private Integer goalPotassium;
}
