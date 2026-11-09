package com.strive.app.controllers;

import com.strive.app.domain.dto.SettingsUpdateRequestDto;
import com.strive.app.domain.dto.UserDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.FoodLogsService;
import com.strive.app.services.NutrientsService;
import com.strive.app.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserControllerSettingsTest {

    private static final String EMAIL = "user@example.com";
    private static final String TOKEN = "Bearer test-token";

    private final UserService userService = mock(UserService.class);
    private final AuthenticationService authenticationService = mock(AuthenticationService.class);
    private final NutrientsService nutrientsService = mock(NutrientsService.class);

    @SuppressWarnings("unchecked")
    private final UserController controller = new UserController(
            userService, mock(Mapper.class), authenticationService,
            mock(FoodLogsService.class), nutrientsService);

    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = UserEntity.builder()
                .email(EMAIL)
                .mainGoal(MainGoal.LOSE_FAT)
                .weightChangeAmount(1.0)
                .build();
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(EMAIL);
        when(authenticationService.validateToken("test-token")).thenReturn(userDetails);
        when(userService.findByEmail(EMAIL)).thenReturn(user);
    }

    private ResponseEntity<String> save(SettingsUpdateRequestDto request) {
        return controller.updateSettings(request, TOKEN);
    }

    @Test
    void switchingGoalWithoutRateResetsToDefault() {
        save(SettingsUpdateRequestDto.builder().mainGoal(MainGoal.BUILD_MUSCLE).build());

        // "Lose 1.0/week" must not become "gain 1.0/week"
        assertThat(user.getWeightChangeAmount()).isEqualTo(0.5);
        verify(nutrientsService).recalculate(user, false);
    }

    @Test
    void keepingSameGoalKeepsRate() {
        save(SettingsUpdateRequestDto.builder().mainGoal(MainGoal.LOSE_FAT).age(31).build());

        assertThat(user.getWeightChangeAmount()).isEqualTo(1.0);
    }

    @Test
    void maintainClearsRate() {
        save(SettingsUpdateRequestDto.builder().mainGoal(MainGoal.MAINTAIN).weightChangeAmount(0.8).build());

        assertThat(user.getWeightChangeAmount()).isNull();
    }

    @Test
    void newRateIsSaved() {
        save(SettingsUpdateRequestDto.builder().mainGoal(MainGoal.BUILD_MUSCLE).weightChangeAmount(0.2).build());

        assertThat(user.getWeightChangeAmount()).isEqualTo(0.2);
    }

    @Test
    void outOfRangeRateIsRejected() {
        ResponseEntity<String> response = save(
                SettingsUpdateRequestDto.builder().mainGoal(MainGoal.BUILD_MUSCLE).weightChangeAmount(5.0).build());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        verify(nutrientsService, never()).recalculate(any(), anyBoolean());
        verify(userService, never()).save(any(UserEntity.class));
    }

    @Test
    void editingProfileWithoutChangingThePlanLimitsCalorieChange() {
        save(SettingsUpdateRequestDto.builder().mainGoal(MainGoal.LOSE_FAT).weightChangeAmount(1.0).age(31).build());

        verify(nutrientsService).recalculate(user, true);
    }

    @Test
    void customCalorieGoalIsSaved() {
        save(SettingsUpdateRequestDto.builder().mainGoal(MainGoal.LOSE_FAT).customCalorieGoal(2600).build());

        assertThat(user.getCustomCalorieGoal()).isEqualTo(2600);
        verify(nutrientsService).recalculate(user, false);
    }

    @Test
    void zeroSwitchesBackToAutomaticCalories() {
        user.setCustomCalorieGoal(2600);

        save(SettingsUpdateRequestDto.builder().customCalorieGoal(0).build());

        assertThat(user.getCustomCalorieGoal()).isNull();
        verify(nutrientsService).recalculate(user, false);
    }

    @Test
    void customCalorieGoalBelowSafeMinimumIsRejected() {
        user.setSexType(GenderType.MALE);

        ResponseEntity<String> response = save(SettingsUpdateRequestDto.builder().customCalorieGoal(1400).build());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(user.getCustomCalorieGoal()).isNull();
        verify(userService, never()).save(any(UserEntity.class));
    }
}
