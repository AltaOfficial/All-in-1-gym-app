package com.strive.app.services;

import com.strive.app.domain.entities.UserEntity;

import java.util.Optional;

public interface UserService {
    UserEntity save(UserEntity user);

    Optional<UserEntity> findOne(Long id);

    boolean isExists(Long id);
}
