package com.strive.app.repositories;

import com.strive.app.domain.entities.WidgetEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WidgetRepository extends CrudRepository<WidgetEntity, Long> {
}
