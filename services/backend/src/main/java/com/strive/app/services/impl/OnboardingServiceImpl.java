package com.strive.app.services.impl;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.domain.dto.OnboardingUpdateRequestDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.NutrientGoalsMapper;
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
    private final NutrientGoalsMapper nutrientGoalsMapper;

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

            if (onboardingUpdateRequestDto.getMainGoal() != null) {
                existingUser.setMainGoal(onboardingUpdateRequestDto.getMainGoal());
                nextOnboardingStep = 7;
            }

            if (onboardingUpdateRequestDto.getWeightChangeAmount() != null) {
                existingUser.setWeightChangeAmount(onboardingUpdateRequestDto.getWeightChangeAmount());
                nextOnboardingStep = 0;
                NutrientGoalsDto nutrientGoalsDto = nutrientsService.calculateNutrientGoals(existingUser.getAge(), existingUser.getWeight(), existingUser.getWeightType(), existingUser.getSexType(), existingUser.getHeightInInches(), existingUser.getWeightChangeAmount(), existingUser.getMainGoal(), existingUser.getTrainingExperience());
                nutrientGoalsMapper.updateUserWithGoals(nutrientGoalsDto, existingUser);
            }
            existingUser.setOnBoardingStep(nextOnboardingStep);

            return userRepository.save(existingUser);
        }).orElseThrow();
    }
}
