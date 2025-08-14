package com.strive.app.services;

import com.strive.app.domain.entities.WidgetEntity;

import java.util.Optional;

public interface WidgetService {
    WidgetEntity createWidget(WidgetEntity widgetEntity);

    Optional<WidgetEntity> findWidgetById(Long id);
}
