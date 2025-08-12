package com.strive.app.dao.impl;

import com.strive.app.dao.WidgetDao;
import com.strive.app.domain.Widget;
import org.springframework.jdbc.core.JdbcTemplate;

public class WidgetDaoImpl implements WidgetDao {
    private final JdbcTemplate jdbcTemplate;

    public WidgetDaoImpl(final JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void create(Widget widget) {
        jdbcTemplate.update("INSERT INTO widgets (id, name, purpose) VALUES (?, ?, ?)", widget.getId(), widget.getWidgetName(), widget.getDescription());
    }
}
