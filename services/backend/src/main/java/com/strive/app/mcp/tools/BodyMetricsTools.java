package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.BodyMetricsLogDto;
import com.strive.app.domain.entities.BodyMetricsLogEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.mcp.support.McpDates;
import com.strive.app.security.CurrentUserProvider;
import com.strive.app.services.BodyMetricsService;
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
public class BodyMetricsTools {

    private final BodyMetricsService bodyMetricsService;
    private final CurrentUserProvider currentUser;
    private final Mapper<BodyMetricsLogEntity, BodyMetricsLogDto> bodyMetricsMapper;

    @McpTool(name = "getLatestBodyMetrics",
            description = "Get the current user's most recently logged body measurements: weight, body fat "
                    + "percentage, and circumference measurements (waist, chest, arms, etc). Does not include "
                    + "progress photos.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public BodyMetricsLogDto getLatestBodyMetrics() {
        UUID userId = currentUser.requireId();
        BodyMetricsLogEntity latest = bodyMetricsService.findFirstByIdUserIdOrderByIdDateDesc(userId);
        if (latest == null) {
            throw new NoSuchElementException("No body metrics have been logged yet.");
        }
        return bodyMetricsMapper.mapTo(latest);
    }

    @McpTool(name = "getBodyMetricsHistory",
            description = "Get the current user's logged body measurements over time, for tracking trends. "
                    + "Omit both dates to get the full history; provide either to filter to a range (missing "
                    + "startDate defaults to 30 days ago, missing endDate defaults to today).",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public List<BodyMetricsLogDto> getBodyMetricsHistory(
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit, with endDate also "
                    + "omitted, for the full history; otherwise defaults to 30 days ago.") LocalDate startDate,
            @McpToolParam(required = false, description = "ISO date (YYYY-MM-DD). Omit, with startDate also "
                    + "omitted, for the full history; otherwise defaults to today.") LocalDate endDate) {
        UUID userId = currentUser.requireId();

        List<BodyMetricsLogEntity> logs;
        if (startDate == null && endDate == null) {
            logs = bodyMetricsService.findAllByUserId(userId);
        } else {
            LocalDate start = McpDates.orLast30Days(startDate);
            LocalDate end = McpDates.orToday(endDate);
            logs = bodyMetricsService.findAllByUserIdAndDateRange(userId, start, end);
        }

        return logs.stream().map(bodyMetricsMapper::mapTo).toList();
    }
}
