package com.strive.app.services.impl;

import com.strive.app.domain.entities.*;
import com.strive.app.repositories.GroceryListItemRepository;
import com.strive.app.repositories.GroceryListRepository;
import com.strive.app.services.GroceryListService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class GroceryListServiceImpl implements GroceryListService {
    private final GroceryListRepository groceryListRepository;
    private final GroceryListItemRepository groceryListItemRepository;

    @Override
    public GroceryListEntity findById(GroceryListId id) {
        return groceryListRepository.findById(id).orElseThrow();
    }

    @Override
    public GroceryListItemEntity findById(UUID id) {
        return groceryListItemRepository.findById(id).orElseThrow();
    }

    @Override
    public List<GroceryListItemEntity> findAllByUserIdAndDateRange(UUID id, LocalDate dateFrom, LocalDate dateTo) {
        return groceryListItemRepository.findAllByUserIdAndDateRange(id, dateFrom, dateTo);
    }

    @Override
    public GroceryListEntity save(GroceryListEntity groceryListEntity) {
        return groceryListRepository.save(groceryListEntity);
    }

    @Override
    @Transactional
    public GroceryListEntity addToGroceryList(GroceryListId groceryListId,
            GroceryListItemEntity groceryListItemEntity) {
        GroceryListEntity groceryListEntity = groceryListRepository.findById(groceryListId).orElseThrow();
        groceryListEntity.addItem(groceryListItemEntity);
        return groceryListEntity;
    }

    @Override
    @Transactional
    public GroceryListEntity removeFromGroceryList(GroceryListId groceryListId,
            GroceryListItemEntity groceryListItemEntity) {
        GroceryListEntity groceryListEntity = groceryListRepository.findById(groceryListId).orElseThrow();

        // Find the actual item by ID and remove it
        groceryListEntity.getGroceryListItems().removeIf(item -> item.getId().equals(groceryListItemEntity.getId()));

        return groceryListEntity;
    }

    @Override
    @Transactional
    public GroceryListItemEntity setItemIsBought(Boolean isBought, UUID groceryListItemId) {
        GroceryListItemEntity groceryListItemEntity = groceryListItemRepository.findById(groceryListItemId)
                .orElseThrow();
        groceryListItemEntity.setIsBought(isBought);
        return groceryListItemEntity;
    }
}
