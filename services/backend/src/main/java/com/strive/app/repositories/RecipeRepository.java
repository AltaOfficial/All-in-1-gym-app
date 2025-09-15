package com.strive.app.repositories;

import com.strive.app.domain.entities.RecipeEntity;
import com.strive.app.domain.entities.RecipeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecipeRepository extends JpaRepository<RecipeEntity, RecipeId> {
    List<RecipeEntity> findAllByIdUserId(UUID id);
}
