package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.MetricsDto;
import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.mcp.support.McpDates;
import com.strive.app.security.CurrentUserProvider;
import com.strive.app.services.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Component
@RequiredArgsConstructor
public class MetricsTools {

    private final MetricsService metricsService;
    private final CurrentUserProvider currentUser;
    private final Mapper<MetricsEntity, MetricsDto> metricsMapper;

    @McpTool(name = "getDailyNutrition",
            description = "Get the current user's nutrition totals and goals for a given day (calories, "
                    + "protein, carbs, fat, and more, each with its goal). Omit the date for today (the "
                    + "server's current UTC date). If nothing has been logged for that day yet, returns the "
                    + "user's goals with all totals at zero.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public MetricsDto getDailyNutrition(
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for today.") LocalDate date) {
        UserEntity me = currentUser.require();
        LocalDate targetDate = McpDates.orToday(date);
        MetricsId id = MetricsId.builder().userId(me.getId()).date(targetDate).build();

        try {
            MetricsEntity entity = metricsService.findOne(id);
            return metricsMapper.mapTo(entity);
        } catch (NoSuchElementException ex) {
            return MetricsDto.builder()
                    .userId(me.getId())
                    .date(targetDate)
                    .currentCalories(0)
                    .goalCalories(me.getGoalCalories())
                    .burnedCalories(0)
                    .protein(0)
                    .goalProtein(me.getGoalProtein())
                    .carbohydrates(0)
                    .goalCarbohydrates(me.getGoalCarbohydrates())
                    .fat(0)
                    .goalFat(me.getGoalFat())
                    .fiber(0)
                    .goalFiber(me.getGoalFiber())
                    .sugar(0)
                    .goalSugar(me.getGoalSugar())
                    .saturatedFat(0)
                    .goalSaturatedFat(me.getGoalSaturatedFat())
                    .polyunsaturatedFat(0)
                    .goalPolyunsaturatedFat(me.getGoalPolyunsaturatedFat())
                    .monounsaturatedFat(0)
                    .goalMonounsaturatedFat(me.getGoalMonounsaturatedFat())
                    .transFat(0)
                    .goalTransFat(me.getGoalTransFat())
                    .cholesterol(0)
                    .goalCholesterol(me.getGoalCholesterol())
                    .sodium(0)
                    .goalSodium(me.getGoalSodium())
                    .potassium(0)
                    .goalPotassium(me.getGoalPotassium())
                    .build();
        }
    }

    @McpTool(name = "getNutritionHistory",
            description = "Get the current user's daily nutrition totals and goals across a date range, one "
                    + "entry per day that has data. Omit startDate for 30 days ago, omit endDate for today.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<MetricsDto> getNutritionHistory(
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for 30 days ago.") LocalDate startDate,
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit for today.") LocalDate endDate) {
        var userId = currentUser.requireId();
        LocalDate start = McpDates.orLast30Days(startDate);
        LocalDate end = McpDates.orToday(endDate);
        return metricsService.findAllByUserIdAndDateRange(userId, start, end).stream()
                .map(metricsMapper::mapTo)
                .toList();
    }
}
