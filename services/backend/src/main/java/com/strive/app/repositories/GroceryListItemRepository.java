package com.strive.app.repositories;

import com.strive.app.domain.entities.GroceryListItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroceryListItemRepository extends JpaRepository<GroceryListItemEntity, UUID> {
}
