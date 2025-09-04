package com.strive.app.repositories;

import com.strive.app.domain.entities.BodyMetricsId;
import com.strive.app.domain.entities.BodyMetricsLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BodyMetricsRepository extends JpaRepository<BodyMetricsLogEntity, BodyMetricsId> {

    @Query("SELECT b FROM BodyMetricsLogEntity b WHERE b.id.userId = :userId AND b.id.date BETWEEN :startDate AND :endDate")
    List<BodyMetricsLogEntity> findAllByUserIdAndDateRange(@Param("userId") UUID userId,
            @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM BodyMetricsLogEntity b WHERE b.id.userId = :userId")
    List<BodyMetricsLogEntity> findAllByUserId(@Param("userId") UUID userId);

    BodyMetricsLogEntity findFirstByIdUserIdOrderByIdDateDesc(UUID userId);
}
