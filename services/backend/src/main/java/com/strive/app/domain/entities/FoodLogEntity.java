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
    @JsonBackReference
    @ToString.Exclude
    private UserEntity user;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "foodLogEntity")
    @JsonManagedReference
    @ToString.Exclude
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
