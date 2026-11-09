package com.strive.app.services.impl;

import com.strive.app.domain.dto.OnboardingUpdateRequestDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.enums.MainGoal;
import com.strive.app.repositories.UserRepository;
import com.strive.app.services.NutrientsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OnboardingServiceImplTest {

    private static final String EMAIL = "user@example.com";

    private final UserRepository userRepository = mock(UserRepository.class);
    private final NutrientsService nutrientsService = mock(NutrientsService.class);
    private final OnboardingServiceImpl service = new OnboardingServiceImpl(userRepository, nutrientsService);

    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = UserEntity.builder().email(EMAIL).onBoardingStep(6).build();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void pickingMaintainFinishesOnboardingWithGoals() {
        UserEntity saved = service.updateOnboardingStep(EMAIL,
                OnboardingUpdateRequestDto.builder().mainGoal(MainGoal.MAINTAIN).build());

        assertThat(saved.getOnBoardingStep()).isZero();
        assertThat(saved.getWeightChangeAmount()).isNull();
        verify(nutrientsService).recalculate(user);
    }

    @Test
    void pickingLoseFatGoesToWeeklyRateScreen() {
        UserEntity saved = service.updateOnboardingStep(EMAIL,
                OnboardingUpdateRequestDto.builder().mainGoal(MainGoal.LOSE_FAT).build());

        assertThat(saved.getOnBoardingStep()).isEqualTo(7);
        verify(nutrientsService, never()).recalculate(any());
    }

    @Test
    void weeklyRateFinishesOnboarding() {
        user.setMainGoal(MainGoal.LOSE_FAT);

        UserEntity saved = service.updateOnboardingStep(EMAIL,
                OnboardingUpdateRequestDto.builder().weightChangeAmount(0.5).build());

        assertThat(saved.getOnBoardingStep()).isZero();
        assertThat(saved.getWeightChangeAmount()).isEqualTo(0.5);
        verify(nutrientsService).recalculate(user);
    }

    @Test
    void stuckMaintainUserCanFinishFromWeeklyRateScreen() {
        // Older app versions left Maintain users on step 7, which shows the weekly rate screen
        user.setMainGoal(MainGoal.MAINTAIN);
        user.setOnBoardingStep(7);

        UserEntity saved = service.updateOnboardingStep(EMAIL,
                OnboardingUpdateRequestDto.builder().weightChangeAmount(0.5).build());

        assertThat(saved.getOnBoardingStep()).isZero();
        assertThat(saved.getWeightChangeAmount()).isNull();
        verify(nutrientsService).recalculate(user);
    }
}
