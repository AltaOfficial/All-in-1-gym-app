package com.strive.app.schedules;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.domain.entities.BodyMetricsLogEntity;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.repositories.BodyMetricsRepository;
import com.strive.app.repositories.UserRepository;
import com.strive.app.services.NutrientsService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class NutrientGoalsScheduler {

    private final UserRepository userRepository;
    private final BodyMetricsRepository bodyMetricsRepository;
    private final NutrientsService nutrientsService;

    public NutrientGoalsScheduler(UserRepository userRepository,
                                  BodyMetricsRepository bodyMetricsRepository,
                                  NutrientsService nutrientsService) {
        this.userRepository = userRepository;
        this.bodyMetricsRepository = bodyMetricsRepository;
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

            List<Double> lastTwoWeeksWeights = weightLogs.stream()
                    .filter(l -> !l.getId().getDate().isBefore(fourteenDaysAgo))
                    .map(BodyMetricsLogEntity::getWeight)
                    .toList();

            List<Double> priorTwoWeeksWeights = weightLogs.stream()
                    .filter(l -> l.getId().getDate().isBefore(fourteenDaysAgo))
                    .map(BodyMetricsLogEntity::getWeight)
                    .toList();

            NutrientGoalsDto goals = nutrientsService.calculateNutrientGoals(
                    user.getAge(),
                    lastTwoWeeksWeights,
                    priorTwoWeeksWeights,
                    user.getWeightType(),
                    user.getSexType(),
                    user.getHeightInInches(),
                    user.getWeightChangeAmount(),
                    user.getMainGoal(),
                    user.getTrainingExperience()
            );

            user.setGoalCalories(goals.getGoalCalories());
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

    private boolean hasCompleteProfile(UserEntity user) {
        return user.getAge() != null
                && user.getWeightType() != null
                && user.getSexType() != null
                && user.getHeightInInches() != null
                && user.getMainGoal() != null
                && user.getTrainingExperience() != null;
    }
}
