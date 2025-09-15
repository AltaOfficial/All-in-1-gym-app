package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "recipes")
public class RecipeEntity {
    @EmbeddedId
    private RecipeId id;

    private String recipeName;
    private Integer servingsAmount;

    @OneToMany(mappedBy = "recipeConnectedTo", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Builder.Default
    private List<FoodEntity> ingredients = new ArrayList<>();
}
