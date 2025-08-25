package com.strive.app.repositories;

import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetricsRepository extends JpaRepository<MetricsEntity, MetricsId> {
}
