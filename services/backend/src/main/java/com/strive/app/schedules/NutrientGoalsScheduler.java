package com.strive.app.schedules;

import com.strive.app.domain.entities.UserEntity;
import com.strive.app.repositories.UserRepository;
import com.strive.app.services.NutrientsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class NutrientGoalsScheduler {

    private static final Logger log = LoggerFactory.getLogger(NutrientGoalsScheduler.class);
    private static final int DAYS_BETWEEN_UPDATES = 14;

    private final UserRepository userRepository;
    private final NutrientsService nutrientsService;

    public NutrientGoalsScheduler(UserRepository userRepository,
                                  NutrientsService nutrientsService) {
        this.userRepository = userRepository;
        this.nutrientsService = nutrientsService;
    }

    /**
     * Runs every day at 4am server time, but only recalculates users whose goals are at least
     * 14 days old. A fixed time (instead of fixedRate) means restarts and deploys don't
     * trigger extra runs.
     */
    @Scheduled(cron = "0 0 4 * * *")
    public void recalculateNutrientGoals() {
        LocalDate dueOnOrBefore = LocalDate.now().minusDays(DAYS_BETWEEN_UPDATES);
        List<UserEntity> dueUsers = userRepository
                .findAllByGoalsUpdatedAtIsNullOrGoalsUpdatedAtLessThanEqual(dueOnOrBefore);

        int updated = 0;
        for (UserEntity user : dueUsers) {
            // One user's bad data shouldn't stop everyone after them from being updated
            try {
                if (nutrientsService.recalculateScheduled(user)) {
                    userRepository.save(user);
                    updated++;
                }
            } catch (RuntimeException e) {
                log.error("Failed to recalculate nutrient goals for user {}", user.getId(), e);
            }
        }
        log.info("Recalculated nutrient goals for {} of {} due users", updated, dueUsers.size());
    }
}
