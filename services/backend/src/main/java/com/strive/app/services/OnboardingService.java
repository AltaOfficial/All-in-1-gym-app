package com.strive.app.services;

import com.strive.app.domain.dto.OnboardingUpdateRequestDto;
import com.strive.app.domain.entities.UserEntity;

public interface OnboardingService {

    UserEntity updateOnboardingStep(String email, OnboardingUpdateRequestDto  onboardingUpdateRequestDto);
}
