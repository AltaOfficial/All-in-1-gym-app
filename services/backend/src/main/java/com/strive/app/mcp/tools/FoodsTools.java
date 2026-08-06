package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.FoodDto;
import com.strive.app.domain.dto.FoodInputDto;
import com.strive.app.domain.dto.FoodLogItemDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.FoodLogEntity;
import com.strive.app.domain.entities.FoodLogId;
import com.strive.app.domain.entities.FoodLogItemEntity;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.mcp.support.McpDates;
import com.strive.app.mcp.support.McpFoodInputs;
import com.strive.app.security.CurrentUserProvider;
import com.strive.app.services.FoodLogsService;
import com.strive.app.services.FoodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FoodsTools {

    private final FoodsService foodsService;
    private final FoodLogsService foodLogsService;
    private final CurrentUserProvider currentUser;
    private final Mapper<FoodEntity, FoodDto> foodMapper;
    private final Mapper<FoodLogItemEntity, FoodLogItemDto> foodLogItemMapper;

    @McpTool(name = "getMyFoods",
            description = "List custom foods the current user has created (not the global food database).",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<FoodDto> getMyFoods() {
        UUID userId = currentUser.requireId();
        return foodsService.findAllByUserCreatedBy_Id(userId).stream().map(foodMapper::mapTo).toList();
    }

    @McpTool(name = "getRecentFoods",
            description = "List foods the current user has recently logged, most recent first.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<FoodDto> getRecentFoods() {
        UUID userId = currentUser.requireId();
        return foodsService.getRecentFoods(userId).stream().map(foodMapper::mapTo).toList();
    }

    @McpTool(name = "searchFoodDatabase",
            description = "Search the USDA food database by name or brand. Nutrient values in the result are "
                    + "per 1 gram of food, not per serving and not per 100 grams - multiply by the actual "
                    + "gram weight eaten to get real amounts.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, openWorldHint = true))
    public List<FoodDto> searchFoodDatabase(
            @McpToolParam(description = "Search text, e.g. 'chicken breast' or a brand name") String query,
            @McpToolParam(required = false, description = "Max number of results to return. Defaults to 10.")
            Integer limit) throws IOException, InterruptedException {
        try {
            List<FoodEntity> results = foodsService.search(query);
            int cap = limit != null ? limit : 10;
            return results.stream().limit(cap).map(foodMapper::mapTo).toList();
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw ex;
        }
    }

    @McpTool(name = "createCustomFood",
            description = "Save a new custom food with its nutrition facts to the current user's personal food "
                    + "library. This does NOT log it to any day's food log. Before calling this tool, describe "
                    + "the food you're about to save and wait for the user to confirm. Do not call this tool "
                    + "speculatively.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = false))
    public FoodDto createCustomFood(@McpToolParam(description = "The food to save") FoodInputDto food) {
        UserEntity me = currentUser.require();

        FoodEntity entity = McpFoodInputs.toEntity(food);
        entity.setUserCreatedBy(me);

        return foodMapper.mapTo(foodsService.save(entity));
    }

    @McpTool(name = "getFoodLog",
            description = "Get the foods the current user logged as eaten on a given day. Omit the date for "
                    + "today (the server's current UTC date).",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<FoodLogItemDto> getFoodLog(
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for today.") LocalDate date) {
        UUID userId = currentUser.requireId();
        LocalDate targetDate = McpDates.orToday(date);
        FoodLogId id = FoodLogId.builder().userId(userId).date(targetDate).build();
        try {
            FoodLogEntity log = foodLogsService.findById(id);
            return log.getFoodItems().stream().map(foodLogItemMapper::mapTo).toList();
        } catch (NoSuchElementException ex) {
            return List.of();
        }
    }
}
