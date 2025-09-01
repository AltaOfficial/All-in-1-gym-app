package com.strive.app.domain.dto;

import com.strive.app.domain.entities.GroceryListId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroceryListRequestDto {
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private GroceryListId groceryListId;
    private GroceryListItemDto groceryListItemDto;
}
