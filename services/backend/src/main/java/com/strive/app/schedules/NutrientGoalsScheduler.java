package com.strive.app.schedules;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.domain.entities.BodyMetricsLogEntity;
import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.repositories.BodyMetricsRepository;
import com.strive.app.repositories.MetricsRepository;
import com.strive.app.repositories.UserRepository;
import com.strive.app.services.NutrientsService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
public class NutrientGoalsScheduler {

    private final UserRepository userRepository;
    private final BodyMetricsRepository bodyMetricsRepository;
    private final MetricsRepository metricsRepository;
    private final NutrientsService nutrientsService;

    public NutrientGoalsScheduler(UserRepository userRepository,
                                  BodyMetricsRepository bodyMetricsRepository,
                                  MetricsRepository metricsRepository,
                                  NutrientsService nutrientsService) {
        this.userRepository = userRepository;
        this.bodyMetricsRepository = bodyMetricsRepository;
        this.metricsRepository = metricsRepository;
        this.nutrientsService = nutrientsService;
    }

    @Scheduled(fixedRate = 14, timeUnit = TimeUnit.DAYS)
    public void recalculateNutrientGoals() {
        System.out.println("NutrientGoalsScheduler fired");
        LocalDate today = LocalDate.now();
        LocalDate fourteenDaysAgo = today.minusDays(14);
        LocalDate twentyEightDaysAgo = today.minusDays(28);

        List<UserEntity> users = userRepository.findAll();

        for (UserEntity user : users) {
            if (!hasCompleteProfile(user)) continue;

            List<BodyMetricsLogEntity> logs = bodyMetricsRepository
                    .findAllByUserIdAndDateRange(user.getId(), twentyEightDaysAgo, today);

            List<BodyMetricsLogEntity> weightLogs = logs.stream()
                    .filter(l -> l.getWeight() != null)
                    .toList();

            if (!hasSufficientWeightData(weightLogs, twentyEightDaysAgo)) continue;

            Map<LocalDate, Double> weightHistory = weightLogs.stream()
                    .collect(Collectors.toMap(
                            l -> l.getId().getDate(),
                            BodyMetricsLogEntity::getWeight
                    ));

            Map<LocalDate, Integer> caloriesHistory = metricsRepository
                    .findAllByUserIdAndDateRange(user.getId(), twentyEightDaysAgo, today)
                    .stream()
                    .filter(m -> m.getCurrentCalories() != null && m.getCurrentCalories() > 0)
                    .collect(Collectors.toMap(
                            m -> m.getId().getDate(),
                            MetricsEntity::getCurrentCalories
                    ));

            NutrientGoalsDto goals = nutrientsService.calculateNutrientGoals(
                    user.getAge(),
                    weightHistory,
                    caloriesHistory,
                    user.getWeightType(),
                    user.getSexType(),
                    user.getHeightInInches(),
                    user.getWeightChangeAmount(),
                    user.getMainGoal(),
                    user.getTrainingExperience()
            );

            int clampedCalories = clampCalorieChange(user.getGoalCalories(), goals.getGoalCalories());
            user.setGoalCalories(clampedCalories);
            user.setGoalProtein(goals.getGoalProtein());
            user.setGoalCarbohydrates(goals.getGoalCarbohydrates());
            user.setGoalFat(goals.getGoalFat());
            user.setGoalFiber(goals.getGoalFiber());
            user.setGoalSugar(goals.getGoalSugar());
            user.setGoalSaturatedFat(goals.getGoalSaturatedFat());
            user.setGoalCholesterol(goals.getGoalCholesterol());
            user.setGoalSodium(goals.getGoalSodium());
            user.setGoalPotassium(goals.getGoalPotassium());

            userRepository.save(user);
        }
    }

    /**
     * Checks that each of the 4 weeks within the 28-day window
     * has at least 4 days of weight data logged.
     */
    private boolean hasSufficientWeightData(List<BodyMetricsLogEntity> weightLogs, LocalDate startDate) {
        int weeksPassing = 0;
        for (int week = 0; week < 4; week++) {
            LocalDate weekStart = startDate.plusDays((long) week * 7);
            LocalDate weekEnd = weekStart.plusDays(6);

            long daysWithData = weightLogs.stream()
                    .map(l -> l.getId().getDate())
                    .filter(date -> !date.isBefore(weekStart) && !date.isAfter(weekEnd))
                    .distinct()
                    .count();

            if (daysWithData >= 4) weeksPassing++;
        }
        return weeksPassing >= 3;
    }

    private static final int MAX_CALORIE_DELTA_PER_CYCLE = 150;

    private int clampCalorieChange(Integer currentGoal, int newGoal) {
        if (currentGoal == null) return newGoal;
        int delta = newGoal - currentGoal;
        int clampedDelta = Math.max(-MAX_CALORIE_DELTA_PER_CYCLE, Math.min(MAX_CALORIE_DELTA_PER_CYCLE, delta));
        return currentGoal + clampedDelta;
    }

    private boolean hasCompleteProfile(UserEntity user) {
        return user.getAge() != null
                && user.getWeightType() != null
                && user.getSexType() != null
                && user.getHeightInInches() != null
                && user.getMainGoal() != null
                && user.getTrainingExperience() != null;
    }
}
