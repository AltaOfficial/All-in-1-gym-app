package com.strive.app.domain.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "mealplans")
public class MealPlanEntity {

    @EmbeddedId
    private MealPlanId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private UserEntity user;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "mealPlanConnectedTo")
    @ToString.Exclude
    @Builder.Default
    private List<FoodEntity> mealPlanItems = new ArrayList<>();

    // helpers to keep both sides in sync
    public void addItem(FoodEntity item) {
        mealPlanItems.add(item);
        item.setMealPlanConnectedTo(this);
    }

    public void removeItem(FoodEntity item) {
        mealPlanItems.remove(item);
        item.setMealPlanConnectedTo(null);
    }
}
