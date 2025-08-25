package com.strive.app.services.impl;

import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;
import com.strive.app.repositories.MetricsRepository;
import com.strive.app.services.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MetricsServiceImpl implements MetricsService {
    private final MetricsRepository metricsRepository;

    @Override
    public MetricsEntity findById(MetricsId id) {
        return metricsRepository.findById(id).orElseThrow();
    }

    @Override
    public MetricsEntity save(MetricsId id, MetricsEntity metricsEntity) {
        return null;
    }

    @Override
    public MetricsEntity save(MetricsEntity metricsEntity) {
        return metricsRepository.save(metricsEntity);
    }
}
