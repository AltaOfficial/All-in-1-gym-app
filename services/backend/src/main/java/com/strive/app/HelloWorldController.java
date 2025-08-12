package com.strive.app;

import com.strive.app.dao.impl.WidgetDaoImpl;
import com.strive.app.domain.Widget;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {

    private JdbcTemplate jdbcTemplate;
    private WidgetDaoImpl widgetDaoImplementation;

    @GetMapping(path = "/hello")
    public String helloWorld() {

        Widget widget = Widget.builder()
                .id(1L)
                .WidgetName("Widdly widget")
                .Description("Testing testing 123")
                .build();

        widgetDaoImplementation.create(widget);

        return widget.getWidgetName();
    }
}
