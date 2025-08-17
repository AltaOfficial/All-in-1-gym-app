package com.strive.app.controllers;

import com.strive.app.domain.dto.AuthResponseDto;
import com.strive.app.domain.dto.LoginRequestDto;
import com.strive.app.domain.dto.SignupRequestDto;
import com.strive.app.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService;

    @PostMapping(path = "/login")
    private ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto loginRequestDto){
        UserDetails userDetails = authenticationService.authenticate(loginRequestDto.getEmail(), loginRequestDto.getPassword());
        String tokenValue = authenticationService.generateToken(userDetails);

        AuthResponseDto authResponseDto = AuthResponseDto.builder().token(tokenValue).expiresIn(86400).build();

        return ResponseEntity.ok(authResponseDto);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@RequestBody SignupRequestDto signupRequestDto) {
        UserDetails userDetails = authenticationService.signup(signupRequestDto.getName(), signupRequestDto.getEmail(), signupRequestDto.getPassword());
        String tokenValue = authenticationService.generateToken(userDetails);
        AuthResponseDto authResponseDto = AuthResponseDto.builder().token(tokenValue).expiresIn(86400).build();
        return ResponseEntity.ok(authResponseDto);
    }
}
