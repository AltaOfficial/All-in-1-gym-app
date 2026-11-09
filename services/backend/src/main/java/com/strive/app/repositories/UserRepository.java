package com.strive.app.repositories;

import com.strive.app.domain.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);

    List<UserEntity> findAllByGoalsUpdatedAtIsNullOrGoalsUpdatedAtLessThanEqual(LocalDate date);
}
