package com.strive.app.domain.entities;

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
@Table(name = "groceryitems")
public class GroceryListItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Boolean isBought;

    private String itemName;
    private Double quantity;
    private Double cost;

    @ManyToOne
    private GroceryListEntity groceryListEntity;

    public void setGroceryList(GroceryListEntity groceryListEntity) {
        this.groceryListEntity = groceryListEntity;
    }
}
