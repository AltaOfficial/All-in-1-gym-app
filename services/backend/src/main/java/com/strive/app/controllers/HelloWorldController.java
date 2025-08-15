package com.strive.app.controllers;

import com.strive.app.domain.entities.WidgetEntity;
import com.strive.app.domain.dto.WidgetDto;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.WidgetService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class HelloWorldController {
    private final WidgetService widgetService;
    private final Mapper<WidgetEntity, WidgetDto> widgetMapper;

    public HelloWorldController(final Mapper<WidgetEntity, WidgetDto> widgetMapper, final WidgetService widgetService){
        this.widgetMapper = widgetMapper;
        this.widgetService = widgetService;
    }

    @GetMapping(path = "/hello")
    public String helloWorld() {

        WidgetDto widget = WidgetDto.builder()
                .widgetName("Widdly widget")
                .description("Testing testing 123")
                .build();

        WidgetEntity widgetEntity = widgetMapper.mapFrom(widget);

        return widgetMapper.mapTo(widgetService.createWidget(widgetEntity)).getWidgetName();
    }

    @GetMapping(path = "widget")
    public Optional<WidgetDto> getWidget() {
        Optional<WidgetEntity> widgetEntity = widgetService.findWidgetById(1L);
        // Optional<WidgetDto> widgetDto = widgetMapper.mapTo(widgetEntity);

        return Optional.empty();
    }

    @PostMapping(path = "widget")
    public Long postWidget(@RequestBody final WidgetDto widget){
        WidgetEntity widgetEntity = widgetMapper.mapFrom(widget);

        WidgetEntity savedWidget = widgetService.createWidget(widgetEntity);

        return widgetMapper.mapTo(savedWidget).getId();
    }
}
