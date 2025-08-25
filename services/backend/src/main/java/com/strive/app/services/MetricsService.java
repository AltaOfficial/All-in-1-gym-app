package com.strive.app.services;

import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;

public interface MetricsService {
    MetricsEntity findById(MetricsId id);

    // find by id and date range

    MetricsEntity save(MetricsId id, MetricsEntity metricsEntity);

    MetricsEntity save(MetricsEntity metricsEntity);
}
