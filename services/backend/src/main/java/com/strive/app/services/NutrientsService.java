package com.strive.app.services;

import com.strive.app.domain.entities.UserEntity;
import com.strive.app.enums.GenderType;

public interface NutrientsService {

    /**
     * Recalculates goals from the user's recent weight and food logs, falling back to the
     * profile weight when there are no weigh-ins. Applies them to the user and to today's
     * metrics. If the user set their own calorie goal, calories stay at it and only the macros
     * are rebuilt. With limitCalorieChange, the automatic calorie goal moves at most 150 kcal
     * from the current one. The caller saves the user.
     */
    void recalculate(UserEntity user, boolean limitCalorieChange);

    /**
     * The scheduled version: skips users without enough recent weight data and always limits
     * how far the calorie goal can move in one run (a calorie goal the user set is never moved).
     * Returns true if goals were updated. The caller saves the user.
     */
    boolean recalculateScheduled(UserEntity user);

    /** Lowest daily calorie goal the app sets, a common minimum without medical supervision. */
    static int minimumCalories(GenderType sex) {
        return (sex == GenderType.MALE) ? 1500 : 1200;
    }
}
