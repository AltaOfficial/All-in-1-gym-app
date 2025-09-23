package com.strive.app.controllers;

import com.strive.app.domain.dto.UserDto;
import com.strive.app.domain.entities.FoodLogEntity;
import com.strive.app.domain.entities.FoodLogId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.FoodLogsService;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path = "/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final Mapper<UserEntity, UserDto> userMapper;
    private final AuthenticationService authenticationService;
    private final FoodLogsService foodLogsService;

    @PostMapping(path = "/create")
    public UserDto createUser(@RequestBody UserDto user) {
        UserEntity newUserEntity = userMapper.mapFrom(user);
        UserEntity savedUserEntity = userService.save(newUserEntity);
        return userMapper.mapTo(savedUserEntity);
    }

    @PostMapping(path = "/update/{id}")
    public UserDto updateUser(@RequestBody UserDto userDto, @PathVariable("id") UUID id) {

        if(!userService.isExists(id)){
            return null;
        }

        return userMapper.mapTo(userService.save(id, userMapper.mapFrom(userDto)));
    }

    @GetMapping(path = "/{id}")
    public Optional<UserDto> getUser(@PathVariable("id") UUID id){
        Optional<UserEntity> foundUserEntity = userService.findOne(id);

        return foundUserEntity.map(userMapper::mapTo);
    }

    @GetMapping(path = "/me")
    public ResponseEntity<UserDto> getUserByJwt(@RequestHeader(name = "Authorization") String jwtToken, @RequestHeader("Date") LocalDate date){
        if(jwtToken.startsWith("Bearer ")){
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
            UserDto userDto = userMapper.mapTo(userService.findByEmail(userDetails.getUsername()));
            userDto.setPassword(null);

            // making sure a food log exists for today
            try {
                foodLogsService.findById(
                        FoodLogId.builder().userId(userEntity.getId()).date(date).build());
            } catch (NoSuchElementException exception) {
                foodLogsService.save(FoodLogEntity.builder().user(userEntity)
                        .id(FoodLogId.builder().userId(userEntity.getId()).date(date).build())
                        .build());
            }
            return ResponseEntity.ok(userDto);
        }
        return null;
    }
}
