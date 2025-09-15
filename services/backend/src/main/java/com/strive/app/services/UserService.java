package com.strive.app.services;

import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.UserEntity;

import java.util.Optional;
import java.util.UUID;

public interface UserService {
    UserEntity save(UserEntity user);

    UserEntity save(UUID id, UserEntity user);

    UserEntity save(String email, UserEntity user);

    void addToRecentFoods(FoodEntity food, UserEntity userEntity);

    void delete(UUID id);

    Optional<UserEntity> findOne(UUID id);

    UserEntity findByEmail(String email);

    boolean isExists(UUID id);
}
