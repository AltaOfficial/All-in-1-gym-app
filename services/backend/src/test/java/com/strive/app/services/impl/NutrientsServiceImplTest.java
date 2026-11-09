package com.strive.app.services.impl;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.domain.entities.BodyMetricsId;
import com.strive.app.domain.entities.BodyMetricsLogEntity;
import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.enums.TrainingExperience;
import com.strive.app.enums.WeightType;
import com.strive.app.mappers.NutrientGoalsMapperImpl;
import com.strive.app.repositories.BodyMetricsRepository;
import com.strive.app.repositories.MetricsRepository;
import com.strive.app.services.MetricsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.strive.app.services.impl.NutrientsServiceImpl.buildGoalsForCalories;
import static com.strive.app.services.impl.NutrientsServiceImpl.calculateNutrientGoals;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NutrientsServiceImplTest {

    private static final LocalDate START = LocalDate.of(2026, 1, 1);
    private static final LocalDate TODAY = LocalDate.now();
    private static final LocalDate YESTERDAY = TODAY.minusDays(1);

    private final BodyMetricsRepository bodyMetricsRepository = mock(BodyMetricsRepository.class);
    private final MetricsRepository metricsRepository = mock(MetricsRepository.class);
    private final MetricsService metricsService = mock(MetricsService.class);

    private final NutrientsServiceImpl service = new NutrientsServiceImpl(
            bodyMetricsRepository, metricsRepository, metricsService, new NutrientGoalsMapperImpl());

    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = UserEntity.builder()
                .id(UUID.randomUUID())
                .age(30)
                .weight(180)
                .weightType(WeightType.LBS)
                .heightInInches(70)
                .sexType(GenderType.MALE)
                .trainingExperience(TrainingExperience.BEGINNER)
                .mainGoal(MainGoal.MAINTAIN)
                .build();
        when(bodyMetricsRepository.findAllByUserIdAndDateRange(any(), any(), any())).thenReturn(List.of());
        when(metricsRepository.findAllByUserIdAndDateRange(any(), any(), any())).thenReturn(List.of());
    }

    // --- Helpers ---

    /** 28 days of the same weight, so the trend is exactly flat. */
    private static Map<LocalDate, Double> flatWeight(double weight) {
        Map<LocalDate, Double> history = new HashMap<>();
        for (int day = 0; day < 28; day++) {
            history.put(START.plusDays(day), weight);
        }
        return history;
    }

    private static Map<LocalDate, Integer> calorieDays(int days, int calories, int startOffset) {
        Map<LocalDate, Integer> history = new HashMap<>();
        for (int day = 0; day < days; day++) {
            history.put(START.plusDays(startOffset + day), calories);
        }
        return history;
    }

    private static int macroCalories(NutrientGoalsDto goals) {
        return goals.getGoalProtein() * 4 + goals.getGoalCarbohydrates() * 4 + goals.getGoalFat() * 9;
    }

    /** One weigh-in and one food log per day, ending yesterday, returned by the mocked repos. */
    private void stubDailyLogs(int days, double weight, int calories) {
        List<BodyMetricsLogEntity> weighIns = new ArrayList<>();
        List<MetricsEntity> foodDays = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            LocalDate date = YESTERDAY.minusDays(i);
            weighIns.add(BodyMetricsLogEntity.builder()
                    .id(BodyMetricsId.builder().userId(user.getId()).date(date).build())
                    .weight(weight)
                    .build());
            foodDays.add(MetricsEntity.builder()
                    .id(MetricsId.builder().userId(user.getId()).date(date).build())
                    .currentCalories(calories)
                    .build());
        }
        when(bodyMetricsRepository.findAllByUserIdAndDateRange(any(), any(), any())).thenReturn(weighIns);
        when(metricsRepository.findAllByUserIdAndDateRange(any(), any(), any())).thenReturn(foodDays);
    }

    // --- Calculation ---

    @Test
    void onboardingWithNoCurrentGoalDoesNotCrash() {
        NutrientGoalsDto goals = calculateNutrientGoals(
                null, 30, Map.of(START, 180.0), Map.of(),
                WeightType.LBS, GenderType.MALE, 70, 1.0,
                MainGoal.LOSE_FAT, TrainingExperience.INTERMEDIATE);

        assertThat(goals.getGoalCalories()).isGreaterThan(0);
    }

    @Test
    void incompleteLogsDoNotUnlockInference() {
        // 10 logged days, but all under half the 2000 goal, so none count as complete
        NutrientGoalsDto withIncompleteLogs = calculateNutrientGoals(
                2000, 30, flatWeight(150.0), calorieDays(10, 500, 0),
                WeightType.LBS, GenderType.MALE, 70, null,
                MainGoal.MAINTAIN, TrainingExperience.BEGINNER);

        NutrientGoalsDto withNoLogs = calculateNutrientGoals(
                2000, 30, flatWeight(150.0), Map.of(),
                WeightType.LBS, GenderType.MALE, 70, null,
                MainGoal.MAINTAIN, TrainingExperience.BEGINNER);

        // Should use the formula estimate, same as having no calorie logs at all
        assertThat(withIncompleteLogs).isEqualTo(withNoLogs);
    }

    @Test
    void inferenceAveragesOnlyCompleteDays() {
        Map<LocalDate, Integer> calories = calorieDays(10, 2500, 0);
        calories.putAll(calorieDays(3, 300, 10)); // partial logs, should be ignored

        NutrientGoalsDto goals = calculateNutrientGoals(
                2400, 30, flatWeight(150.0), calories,
                WeightType.LBS, GenderType.MALE, 70, null,
                MainGoal.MAINTAIN, TrainingExperience.BEGINNER);

        // Flat weight on 2500 kcal/day means maintenance is 2500
        assertThat(goals.getGoalCalories()).isEqualTo(2500);
    }

    @Test
    void inferenceAccountsForWeightTrend() {
        // Losing 1 lb/week on 2500 kcal/day means maintenance is 2500 + 500
        Map<LocalDate, Double> weights = new HashMap<>();
        for (int day = 0; day < 28; day++) {
            weights.put(START.plusDays(day), 200.0 - day / 7.0);
        }

        NutrientGoalsDto goals = calculateNutrientGoals(
                2500, 30, weights, calorieDays(28, 2500, 0),
                WeightType.LBS, GenderType.MALE, 70, null,
                MainGoal.MAINTAIN, TrainingExperience.BEGINNER);

        assertThat(goals.getGoalCalories()).isEqualTo(3000);
    }

    @Test
    void oneNoisyWeighInDoesNotSwingTheGoal() {
        // 29 days of flat weight: with weekly averages, the last day sat alone in its own
        // "week" and a 2 lb water swing moved the goal by ~200 kcal
        Map<LocalDate, Double> weights = new HashMap<>();
        for (int day = 0; day < 29; day++) {
            weights.put(START.plusDays(day), 180.0);
        }
        NutrientGoalsDto steady = calculateNutrientGoals(
                2500, 30, weights, calorieDays(28, 2500, 0),
                WeightType.LBS, GenderType.MALE, 70, null,
                MainGoal.MAINTAIN, TrainingExperience.BEGINNER);

        weights.put(START.plusDays(28), 182.0);
        NutrientGoalsDto noisy = calculateNutrientGoals(
                2500, 30, weights, calorieDays(28, 2500, 0),
                WeightType.LBS, GenderType.MALE, 70, null,
                MainGoal.MAINTAIN, TrainingExperience.BEGINNER);

        assertThat(steady.getGoalCalories() - noisy.getGoalCalories()).isBetween(0, 60);
    }

    @Test
    void calorieGoalNeverDropsBelowMinimum() {
        // 5'2", 130 lb, 25-year-old woman losing 2 lb/week: formula gives ~771 kcal
        NutrientGoalsDto goals = calculateNutrientGoals(
                null, 25, Map.of(START, 130.0), Map.of(),
                WeightType.LBS, GenderType.FEMALE, 62, 2.0,
                MainGoal.LOSE_FAT, TrainingExperience.BEGINNER);

        assertThat(goals.getGoalCalories()).isEqualTo(1200);
        assertThat(goals.getGoalCarbohydrates()).isGreaterThanOrEqualTo(0);
    }

    @Test
    void proteinIsCappedSoCarbsNeverGoNegative() {
        NutrientGoalsDto goals = buildGoalsForCalories(1200, 300, GenderType.FEMALE, 30);

        assertThat(goals.getGoalCarbohydrates()).isZero();
        assertThat(goals.getGoalProtein()).isEqualTo(225); // (1200 - 300 fat kcal) / 4
        assertThat(macroCalories(goals)).isLessThanOrEqualTo(1200);
    }

    @Test
    void macrosAddUpToTheRequestedCalories() {
        NutrientGoalsDto goals = buildGoalsForCalories(2050, 150, GenderType.MALE, 30);

        assertThat(goals.getGoalCalories()).isEqualTo(2050);
        assertThat(goals.getGoalProtein()).isEqualTo(150);
        // Only integer rounding should separate the macro total from the goal
        assertThat(macroCalories(goals)).isBetween(2050 - 12, 2050);
    }

    // --- Recalculating from the user's logs ---

    @Test
    void historyWindowEndsYesterday() {
        service.recalculate(user);

        verify(bodyMetricsRepository).findAllByUserIdAndDateRange(user.getId(), TODAY.minusDays(28), YESTERDAY);
        verify(metricsRepository).findAllByUserIdAndDateRange(user.getId(), TODAY.minusDays(28), YESTERDAY);
    }

    @Test
    void recalculateFallsBackToProfileWeightWithoutWeighIns() {
        service.recalculate(user);

        assertThat(user.getGoalCalories()).isGreaterThan(0);
        assertThat(user.getGoalProtein()).isEqualTo((int) Math.round(180 / 2.205 * 2));
        assertThat(user.getGoalsUpdatedAt()).isEqualTo(TODAY);
        verify(metricsService).updateTodaysGoals(any(), any());
    }

    @Test
    void recalculateUsesLoggedIntakeInsteadOfFormula() {
        // Flat weight on 3000 kcal/day: the logs say maintenance is 3000
        user.setGoalCalories(2200);
        stubDailyLogs(28, 180.0, 3000);

        service.recalculate(user);

        assertThat(user.getGoalCalories()).isEqualTo(3000);
    }

    @Test
    void scheduledRunLimitsCalorieChangeAndKeepsMacrosConsistent() {
        user.setGoalCalories(2200);
        stubDailyLogs(28, 180.0, 3000);

        boolean updated = service.recalculateScheduled(user);

        assertThat(updated).isTrue();
        assertThat(user.getGoalCalories()).isEqualTo(2350);
        int macroCalories = user.getGoalProtein() * 4 + user.getGoalCarbohydrates() * 4 + user.getGoalFat() * 9;
        assertThat(macroCalories).isBetween(2350 - 12, 2350);
    }

    @Test
    void scheduledRunSkipsUsersWithoutEnoughWeighIns() {
        user.setGoalCalories(2200);
        stubDailyLogs(5, 180.0, 3000);

        boolean updated = service.recalculateScheduled(user);

        assertThat(updated).isFalse();
        assertThat(user.getGoalCalories()).isEqualTo(2200);
        verify(metricsService, never()).updateTodaysGoals(any(), any());
    }
}
