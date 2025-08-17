package com.strive.app.services.impl;

import com.strive.app.domain.entities.UserEntity;
import com.strive.app.repositories.UserRepository;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public boolean isExists(UUID id) {
        return userRepository.existsById(id);
    }

    @Override
    public UserEntity save(UserEntity userEntity){
        return userRepository.save(userEntity);
    }

    @Override
    public UserEntity save(UUID id, UserEntity userEntity) {
        return userRepository.findById(id).map(existingUser -> {
            Optional.ofNullable(userEntity.getEmail()).ifPresent(existingUser::setEmail);
            Optional.ofNullable(userEntity.getName()).ifPresent(existingUser::setName);
            return userRepository.save(existingUser);
        }).orElseThrow();
    }

    @Override
    public void delete(UUID id){
        userRepository.deleteById(id);
    }

    @Override
    public Optional<UserEntity> findOne(UUID id){
        return userRepository.findById(id);
    }
}
