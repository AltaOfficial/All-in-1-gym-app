package com.strive.app.services.impl;

import com.strive.app.domain.entities.BodyMetricsId;
import com.strive.app.domain.entities.BodyMetricsLogEntity;
import com.strive.app.repositories.BodyMetricsRepository;
import com.strive.app.services.BodyMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BodyMetricsServiceImpl implements BodyMetricsService {
    private final BodyMetricsRepository bodyMetricsRepository;

    @Override
    public BodyMetricsLogEntity save(BodyMetricsLogEntity bodyMetricsLogEntity) {
        return bodyMetricsRepository.save(bodyMetricsLogEntity);
    }

    @Override
    public BodyMetricsLogEntity findOne(BodyMetricsId id) {
        return bodyMetricsRepository.findById(id).orElseThrow();
    }

    @Override
    public List<BodyMetricsLogEntity> findAllByUserId(UUID userId) {
        return bodyMetricsRepository.findAllByUserId(userId);
    }

    @Override
    public List<BodyMetricsLogEntity> findAllByUserIdAndDateRange(UUID userId, LocalDate startDate, LocalDate endDate) {
        return bodyMetricsRepository.findAllByUserIdAndDateRange(userId, startDate, endDate);
    }

    @Override
    public void delete(BodyMetricsId id) {
        bodyMetricsRepository.deleteById(id);
    }

    @Override
    public BodyMetricsLogEntity findFirstByIdUserIdOrderByIdDateDesc(UUID userId) {
        return bodyMetricsRepository.findFirstByIdUserIdOrderByIdDateDesc(userId);
    }
}
