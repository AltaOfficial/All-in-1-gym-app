package com.strive.app.services;

import com.strive.app.domain.entities.UserEntity;

import java.util.Optional;

public interface UserService {
    UserEntity save(UserEntity user);

    UserEntity save(Long id, UserEntity user);

    void delete(Long id);

    Optional<UserEntity> findOne(Long id);

    boolean isExists(Long id);
}
