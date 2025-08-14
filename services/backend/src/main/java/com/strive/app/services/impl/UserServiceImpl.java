package com.strive.app.services.impl;

import com.strive.app.domain.entities.UserEntity;
import com.strive.app.repositories.UserRepository;
import com.strive.app.services.UserService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(final UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public boolean isExists(Long id) {
        return userRepository.existsById(id);
    }

    @Override
    public UserEntity save(UserEntity userEntity){
        return userRepository.save(userEntity);
    }

    @Override
    public Optional<UserEntity> findOne(Long id){
        return userRepository.findById(id);
    }
}
