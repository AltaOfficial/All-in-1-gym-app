package com.strive.app.repositories;

import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface MetricsRepository extends JpaRepository<MetricsEntity, MetricsId> {

    @Query("SELECT m FROM MetricsEntity m WHERE m.id.userId = :userId AND m.id.date BETWEEN :startDate AND :endDate")
    List<MetricsEntity> findAllByUserIdAndDateRange(@Param("userId") UUID userId,
            @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
