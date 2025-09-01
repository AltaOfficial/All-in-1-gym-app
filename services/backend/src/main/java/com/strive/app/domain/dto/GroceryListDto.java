package com.strive.app.domain.dto;

import com.strive.app.domain.entities.GroceryListId;
import com.strive.app.domain.entities.GroceryListItemEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroceryListDto {

    private GroceryListId id;

    private UUID userId;

    private List<GroceryListItemEntity> groceryListItems = new ArrayList<>();
}
