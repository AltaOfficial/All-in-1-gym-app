package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "foodlogs")
public class FoodLogEntity {

    @EmbeddedId
    private FoodLogId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "foodLogEntity")
    @Builder.Default
    private List<FoodLogItemEntity> foodItems = new ArrayList<>();

    // helpers to keep both sides in sync
    public void addItem(FoodLogItemEntity item) {
        foodItems.add(item);
        item.setFoodLog(this);
    }
    public void removeItem(FoodLogItemEntity item) {
        foodItems.remove(item);
        item.setFoodLog(null);
    }
}
