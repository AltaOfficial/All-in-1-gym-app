package com.strive.app.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.strive.app.domain.entities.GroceryListEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroceryListItemDto {
    private UUID id;

    @Builder.Default
    private Boolean isBought = false;

    private String itemName;
    private Double quantity;
    private Double cost;

    private LocalDate groceryListEntityIdDateFrom;
    private LocalDate groceryListEntityIdDateTo;
}
