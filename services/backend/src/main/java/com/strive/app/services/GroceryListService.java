package com.strive.app.services;

import com.strive.app.domain.dto.LogFoodRequestDto;
import com.strive.app.domain.entities.GroceryListEntity;
import com.strive.app.domain.entities.GroceryListId;
import com.strive.app.domain.entities.GroceryListItemEntity;

import java.util.UUID;

public interface GroceryListService {
    GroceryListEntity findById(GroceryListId id);
    GroceryListItemEntity findById(UUID id);
    GroceryListEntity save(GroceryListEntity groceryListEntity);

    GroceryListEntity addToGroceryList(GroceryListId groceryListId, GroceryListItemEntity groceryListItemEntity);
    GroceryListEntity removeFromGroceryList(GroceryListId groceryListId, GroceryListItemEntity groceryListItemEntity);

    GroceryListItemEntity setItemIsBought(Boolean isBought, UUID groceryListItemId);
}
