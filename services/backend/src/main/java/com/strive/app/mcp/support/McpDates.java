package com.strive.app.mcp.support;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

/**
 * Date-defaulting helpers shared by the MCP tools.
 * <p>
 * MCP tool calls carry no client-local-date signal the way the mobile app's {@code Date} header
 * does, so an omitted date always resolves against the server's JVM clock (UTC in production).
 * Every tool that takes a date parameter should describe that default explicitly so the model
 * can compensate by passing an explicit date when the user's local day matters.
 */
public final class McpDates {

    private McpDates() {
    }

    public static LocalDate orToday(LocalDate date) {
        return date != null ? date : LocalDate.now();
    }

    public static LocalDate orLast30Days(LocalDate startDate) {
        return startDate != null ? startDate : LocalDate.now().minusDays(30);
    }

    /**
     * @return the Monday that starts the current week - used as the default start of the
     * weekly grocery-list bucket.
     */
    public static LocalDate currentWeekStart() {
        return LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }

    /**
     * @return the Sunday that ends the current week - used as the default end of the weekly
     * grocery-list bucket.
     */
    public static LocalDate currentWeekEnd() {
        return LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
    }
}
