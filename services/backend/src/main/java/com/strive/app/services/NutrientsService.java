package com.strive.app.services;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.enums.TrainingExperience;
import com.strive.app.enums.WeightType;

import java.util.List;

public interface NutrientsService {
    NutrientGoalsDto calculateNutrientGoals(Integer age, List<Double> lastTwoWeeksWeights, List<Double> priorTwoWeeksWeights, WeightType weightType, GenderType sex, Integer heightInInches, Double weightChangeAmount, MainGoal mainGoal, TrainingExperience trainingExperience);
}
