package com.strive.app.controllers;

import com.strive.app.domain.dto.WidgetDto;
import com.strive.app.domain.entities.WidgetEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.WidgetService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class WidgetController {

    private final WidgetService widgetService;
    private final Mapper<WidgetEntity, WidgetDto> widgetMapper;

    public WidgetController(final WidgetService widgetService, final Mapper<WidgetEntity, WidgetDto> widgetMapper){
        this.widgetService = widgetService;
        this.widgetMapper = widgetMapper;
    }

    @GetMapping(path = "/widget/{id}")
    public Optional<WidgetDto> getWidget(@PathVariable(name = "id") Long id){
        return widgetService.findWidgetById(id).map(widgetMapper::mapTo);
    }

    @PostMapping(path = "/widget/create")
    public WidgetDto createWidget(@RequestBody WidgetDto widgetDto) {
        return widgetMapper.mapTo(widgetService.createWidget(widgetMapper.mapFrom(widgetDto)));
    }
}
