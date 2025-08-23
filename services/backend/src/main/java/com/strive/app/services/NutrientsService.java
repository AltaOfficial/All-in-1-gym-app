package com.strive.app.services;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.enums.TrainingExperience;
import com.strive.app.enums.WeightType;

public interface NutrientsService {
    NutrientGoalsDto calculateNutrientGoals(Integer age, Integer weight, WeightType weightType, GenderType sex, Integer heightInInches, Double weightChangeAmount, MainGoal mainGoal, TrainingExperience trainingExperience);
}
