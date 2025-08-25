package com.strive.app.controllers;

import com.strive.app.domain.dto.OnboardingUpdateRequestDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.OnboardingService;
import com.strive.app.services.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/onboarding")
@RequiredArgsConstructor
public class OnboardingController {
    private final OnboardingService onboardingService;
    private final AuthenticationService authenticationService;

    @PostMapping("/update")
    public ResponseEntity<String> updateFlow(@RequestBody OnboardingUpdateRequestDto onboardingUpdateRequestDto, @RequestHeader(name = "Authorization")  String jwtToken) {
        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            onboardingService.updateOnboardingStep(userDetails.getUsername(), onboardingUpdateRequestDto);
            return new ResponseEntity<>("true", HttpStatus.OK);
        }else {
            return new ResponseEntity<>("false", HttpStatus.UNAUTHORIZED);
        }
    }
}
