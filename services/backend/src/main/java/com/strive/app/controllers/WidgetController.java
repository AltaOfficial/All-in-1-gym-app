package com.strive.app.controllers;

import com.strive.app.domain.dto.UserDto;
import com.strive.app.domain.dto.WidgetDto;
import com.strive.app.domain.entities.WidgetEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.security.AppUserDetails;
import com.strive.app.services.WidgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class WidgetController {

    private final WidgetService widgetService;
    private final Mapper<WidgetEntity, WidgetDto> widgetMapper;

    @GetMapping(path = "/widget/{id}")
    public Optional<WidgetDto> getWidget(@PathVariable(name = "id") Long id){
        return widgetService.findWidgetById(id).map(widgetMapper::mapTo);
    }

    @PostMapping(path = "/widget/create")
    public WidgetDto createWidget(@RequestBody WidgetDto widgetDto, @AuthenticationPrincipal AppUserDetails appUserDetails) {
        UserDto userDto = UserDto.builder().Id(appUserDetails.getId()).build();
        widgetDto.setUser(userDto);
        return widgetMapper.mapTo(widgetService.createWidget(widgetMapper.mapFrom(widgetDto)));
    }
}
