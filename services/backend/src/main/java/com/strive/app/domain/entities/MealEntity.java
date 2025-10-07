package com.strive.app.domain.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "meals")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MealEntity {
    @EmbeddedId
    private MealId id;

    private URL mealImageUrl;

    @Column(nullable = false)
    private String mealName;

    @OneToMany(mappedBy = "mealConnectedTo", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    @Builder.Default
    private List<FoodEntity> foodItems = new java.util.ArrayList<>();
}
