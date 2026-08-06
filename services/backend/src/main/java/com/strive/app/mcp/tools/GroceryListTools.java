package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.GroceryListItemDto;
import com.strive.app.domain.entities.GroceryListEntity;
import com.strive.app.domain.entities.GroceryListId;
import com.strive.app.domain.entities.GroceryListItemEntity;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.mcp.support.McpDates;
import com.strive.app.mcp.support.McpOwnership;
import com.strive.app.security.CurrentUserProvider;
import com.strive.app.services.GroceryListService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GroceryListTools {

    private final GroceryListService groceryListService;
    private final CurrentUserProvider currentUser;
    private final McpOwnership ownership;
    private final Mapper<GroceryListItemEntity, GroceryListItemDto> groceryItemMapper;

    @McpTool(name = "getGroceryItems",
            description = "List the current user's grocery items whose list overlaps a date range. Grocery "
                    + "lists are bucketed by week. Omit both dates to use the current week (Monday-Sunday).",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<GroceryListItemDto> getGroceryItems(
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for the start of the "
                    + "current week (Monday).") LocalDate dateFrom,
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for the end of the "
                    + "current week (Sunday).") LocalDate dateTo) {
        UUID userId = currentUser.requireId();
        LocalDate from = dateFrom != null ? dateFrom : McpDates.currentWeekStart();
        LocalDate to = dateTo != null ? dateTo : McpDates.currentWeekEnd();
        return groceryListService.findAllByUserIdAndDateRange(userId, from, to).stream()
                .map(groceryItemMapper::mapTo)
                .toList();
    }

    @McpTool(name = "addGroceryItem",
            description = "Add an item to the current user's grocery list for a date range. Grocery lists are "
                    + "bucketed by week; omit both dates to use the current week (Monday-Sunday). Before "
                    + "calling this tool, describe the item you're about to add and wait for the user to "
                    + "confirm. Do not call this tool speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = false))
    public List<GroceryListItemDto> addGroceryItem(
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for the start of the "
                    + "current week (Monday).") LocalDate dateFrom,
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for the end of the "
                    + "current week (Sunday).") LocalDate dateTo,
            @McpToolParam(description = "Name of the item to add") String itemName,
            @McpToolParam(required = false, description = "Quantity to buy") Double quantity,
            @McpToolParam(required = false, description = "Estimated cost") Double cost) {
        UserEntity me = currentUser.require();
        LocalDate from = dateFrom != null ? dateFrom : McpDates.currentWeekStart();
        LocalDate to = dateTo != null ? dateTo : McpDates.currentWeekEnd();
        GroceryListId id = GroceryListId.builder().userId(me.getId()).dateFrom(from).dateTo(to).build();

        ensureGroceryListExists(id, me);

        GroceryListItemEntity item = GroceryListItemEntity.builder()
                .itemName(itemName)
                .quantity(quantity)
                .cost(cost)
                .isBought(false)
                .build();

        GroceryListEntity saved = groceryListService.addToGroceryList(id, item);
        return saved.getGroceryListItems().stream().map(groceryItemMapper::mapTo).toList();
    }

    @McpTool(name = "removeGroceryItem",
            description = "Remove an item from the current user's grocery list. Before calling this tool, name "
                    + "the item you're about to remove and wait for the user to confirm. Do not call this tool "
                    + "speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = true))
    public List<GroceryListItemDto> removeGroceryItem(
            @McpToolParam(description = "Id of the grocery item to remove, from getGroceryItems") UUID itemId) {
        UUID userId = currentUser.requireId();
        GroceryListItemEntity target = ownership.groceryItem(itemId, userId);
        GroceryListId bucketId = target.getGroceryListEntity().getId();

        GroceryListEntity updated = groceryListService.removeFromGroceryList(bucketId, target);
        return updated.getGroceryListItems().stream().map(groceryItemMapper::mapTo).toList();
    }

    private void ensureGroceryListExists(GroceryListId id, UserEntity me) {
        try {
            groceryListService.findById(id);
        } catch (NoSuchElementException ex) {
            groceryListService.save(GroceryListEntity.builder().user(me).id(id).build());
        }
    }
}
