package com.strive.app.services;

import com.strive.app.domain.entities.UserEntity;

public interface NutrientsService {

    /**
     * Recalculates goals from the user's recent weight and food logs, falling back to the
     * profile weight when there are no weigh-ins. Applies them to the user and to today's
     * metrics. The caller saves the user.
     */
    void recalculate(UserEntity user);

    /**
     * The scheduled version: skips users without enough recent weight data and limits how far
     * the calorie goal can move in one run. Returns true if goals were updated. The caller
     * saves the user.
     */
    boolean recalculateScheduled(UserEntity user);
}
