package com.strive.app.repositories;

import com.strive.app.domain.entities.GroceryListItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface GroceryListItemRepository extends JpaRepository<GroceryListItemEntity, UUID> {
    @Query("SELECT g FROM GroceryListItemEntity g WHERE g.groceryListEntity.id.userId = :userId AND ((g.groceryListEntity.id.dateFrom BETWEEN :dateFrom AND :dateTo) OR (g.groceryListEntity.id.dateTo BETWEEN :dateFrom AND :dateTo))")
    List<GroceryListItemEntity> findAllByUserIdAndDateRange(@Param("userId") UUID userId,
                                                           @Param("dateFrom") LocalDate dateFrom,
                                                            @Param("dateTo") LocalDate dateTo);
}
