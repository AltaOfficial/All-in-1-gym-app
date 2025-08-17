package com.strive.app.services.impl;

import com.strive.app.domain.entities.WidgetEntity;
import com.strive.app.repositories.WidgetRepository;
import com.strive.app.services.WidgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WidgetServiceImpl implements WidgetService {

    private final WidgetRepository widgetRepository;

    @Override
    public WidgetEntity createWidget(WidgetEntity widgetEntity){
        return widgetRepository.save(widgetEntity);
    }

    @Override
    public Optional<WidgetEntity> findWidgetById(Long id){
        return widgetRepository.findById(id);
    }
}
