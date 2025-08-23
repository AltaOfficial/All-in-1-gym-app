package com.strive.app.controllers;

import com.strive.app.domain.dto.AuthResponseDto;
import com.strive.app.domain.dto.LoginRequestDto;
import com.strive.app.domain.dto.SignupRequestDto;
import com.strive.app.domain.dto.UserDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final Mapper<UserEntity, UserDto> userMapper;

    @PostMapping(path = "/login")
    private ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto loginRequestDto){
        UserDetails userDetails = authenticationService.authenticate(loginRequestDto.getEmail(), loginRequestDto.getPassword());
        return getAuthResponseDtoResponseEntity(userDetails);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@RequestBody SignupRequestDto signupRequestDto) {
        UserDetails userDetails = authenticationService.signup(signupRequestDto.getName(), signupRequestDto.getEmail(), signupRequestDto.getPassword());
        return getAuthResponseDtoResponseEntity(userDetails);
    }

    @GetMapping("/validate")
    public ResponseEntity<AuthResponseDto> validateToken(@RequestHeader("Authorization") String jwtToken) {
        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            authenticationService.generateToken(userDetails);
            UserDto userDto = userMapper.mapTo(userService.findByEmail(userDetails.getUsername()));
            userDto.setPassword(null);
            AuthResponseDto authResponseDto = AuthResponseDto.builder().user(userDto).token(authenticationService.generateToken(userDetails)).expiresIn(86400).build();
            return ResponseEntity.ok(authResponseDto);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/validate/email")
    public ResponseEntity<Boolean> validateEmail(@RequestBody LoginRequestDto loginRequestDto) {
        System.out.println(loginRequestDto.getEmail().toLowerCase());
        try{
            userDetailsService.loadUserByUsername(loginRequestDto.getEmail().toLowerCase());
            return ResponseEntity.ok(true);
        }catch (UsernameNotFoundException exception){
            return ResponseEntity.ok(false);
        }
    }

    private ResponseEntity<AuthResponseDto> getAuthResponseDtoResponseEntity(UserDetails userDetails) {
        String tokenValue = authenticationService.generateToken(userDetails);
        UserDto userDto = userMapper.mapTo(userService.findByEmail(userDetails.getUsername()));
        userDto.setPassword(null);
        AuthResponseDto authResponseDto = AuthResponseDto.builder().token(tokenValue).user(userDto).expiresIn(86400).build();
        return ResponseEntity.ok(authResponseDto);
    }

}
