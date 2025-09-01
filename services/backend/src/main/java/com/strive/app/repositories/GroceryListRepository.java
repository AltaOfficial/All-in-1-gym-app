package com.strive.app.repositories;

import com.strive.app.domain.entities.GroceryListEntity;
import com.strive.app.domain.entities.GroceryListId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroceryListRepository extends JpaRepository<GroceryListEntity, GroceryListId> {
}
