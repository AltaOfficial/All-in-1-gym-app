package com.strive.app.controllers;

import com.strive.app.domain.dto.UserDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class UserController {

    private final UserService userService;
    private final Mapper<UserEntity, UserDto> userMapper;

    public UserController(final UserService userService, final Mapper<UserEntity, UserDto> userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping(path = "/users/create")
    public UserDto createUser(@RequestBody UserDto user) {
        UserEntity newUserEntity = userMapper.mapFrom(user);
        UserEntity savedUserEntity =  userService.save(newUserEntity);
        return userMapper.mapTo(savedUserEntity);
    }

    @PostMapping(path = "/users/update/{id}")
    public UserDto updateUser(@RequestBody UserDto userDto, @PathVariable("id") Long id) {

        if(!userService.isExists(id)){
            return null;
        }
        userDto.setId(id);

        return userMapper.mapTo(userService.save(userMapper.mapFrom(userDto)));
    }

    @GetMapping(path = "/users/{id}")
    public Optional<UserDto> getUser(@PathVariable("id") Long id){
        Optional<UserEntity> foundUserEntity = userService.findOne(id);

        return foundUserEntity.map(userMapper::mapTo);
    }
}
