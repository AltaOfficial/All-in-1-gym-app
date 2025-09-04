package com.strive.app.services;

import com.strive.app.domain.entities.BodyMetricsId;
import com.strive.app.domain.entities.BodyMetricsLogEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface BodyMetricsService {
    BodyMetricsLogEntity save(BodyMetricsLogEntity bodyMetricsLogEntity);

    BodyMetricsLogEntity findOne(BodyMetricsId id);
    List<BodyMetricsLogEntity> findAllByUserId(UUID userId);
    List<BodyMetricsLogEntity> findAllByUserIdAndDateRange(UUID userId, LocalDate startDate, LocalDate endDate);

    void delete(BodyMetricsId id);

    BodyMetricsLogEntity findFirstByIdUserIdOrderByIdDateDesc(UUID userId);
}
