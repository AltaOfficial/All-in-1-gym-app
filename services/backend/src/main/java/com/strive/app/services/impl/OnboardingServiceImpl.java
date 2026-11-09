package com.strive.app.services.impl;

import com.strive.app.domain.dto.OnboardingUpdateRequestDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.enums.MainGoal;
import com.strive.app.repositories.UserRepository;
import com.strive.app.services.NutrientsService;
import com.strive.app.services.OnboardingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OnboardingServiceImpl implements OnboardingService {
    private final UserRepository userRepository;
    private final NutrientsService nutrientsService;

    @Override
    public UserEntity updateOnboardingStep(String email, OnboardingUpdateRequestDto onboardingUpdateRequestDto) {
        return userRepository.findByEmail(email).map(existingUser -> {
            int nextOnboardingStep = 1;
            if((onboardingUpdateRequestDto.getAge() != null)) {
                existingUser.setAge(onboardingUpdateRequestDto.getAge());
                nextOnboardingStep = 2;
            }
            if((onboardingUpdateRequestDto.getWeight() != null) && (onboardingUpdateRequestDto.getWeightType() != null)) {
                existingUser.setWeight(onboardingUpdateRequestDto.getWeight());
                existingUser.setWeightType(onboardingUpdateRequestDto.getWeightType());
                nextOnboardingStep = 3;
            }
            if (onboardingUpdateRequestDto.getHeightInInches() != null) {
                existingUser.setHeightInInches(onboardingUpdateRequestDto.getHeightInInches());
                nextOnboardingStep = 4;
            }

            if (onboardingUpdateRequestDto.getSexType() != null) {
                existingUser.setSexType(onboardingUpdateRequestDto.getSexType());
                nextOnboardingStep = 5;
            }

            if (onboardingUpdateRequestDto.getTrainingExperience() != null) {
                existingUser.setTrainingExperience(onboardingUpdateRequestDto.getTrainingExperience());
                nextOnboardingStep = 6;
            }

            boolean onboardingFinished = false;

            if (onboardingUpdateRequestDto.getMainGoal() != null) {
                existingUser.setMainGoal(onboardingUpdateRequestDto.getMainGoal());
                nextOnboardingStep = 7;
                // Maintain has no weekly rate, so the app skips that screen and onboarding ends here
                if (existingUser.getMainGoal() == MainGoal.MAINTAIN) {
                    existingUser.setWeightChangeAmount(null);
                    onboardingFinished = true;
                }
            }

            if (onboardingUpdateRequestDto.getWeightChangeAmount() != null) {
                // Users who picked Maintain on an older app version can still land on the weekly
                // rate screen. Let them finish, but don't store a rate that Maintain doesn't use.
                existingUser.setWeightChangeAmount(existingUser.getMainGoal() == MainGoal.MAINTAIN
                        ? null
                        : onboardingUpdateRequestDto.getWeightChangeAmount());
                onboardingFinished = true;
            }

            if (onboardingFinished) {
                nextOnboardingStep = 0;
                nutrientsService.recalculate(existingUser, false);
            }
            existingUser.setOnBoardingStep(nextOnboardingStep);

            return userRepository.save(existingUser);
        }).orElseThrow();
    }
}
