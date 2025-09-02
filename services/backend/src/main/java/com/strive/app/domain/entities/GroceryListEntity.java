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
@Table(name = "grocerylists")
public class GroceryListEntity {

    @EmbeddedId
    private GroceryListId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    @ToString.Exclude
    private UserEntity user;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "groceryListEntity")
    @JsonManagedReference
    @ToString.Exclude
    @Builder.Default
    private List<GroceryListItemEntity> groceryListItems = new ArrayList<>();

    // helpers to keep both sides in sync
    public void addItem(GroceryListItemEntity item) {
        groceryListItems.add(item);
        item.setGroceryList(this);
    }

    public void removeItem(GroceryListItemEntity item) {
        groceryListItems.remove(item);
        item.setGroceryList(null);
    }
}
