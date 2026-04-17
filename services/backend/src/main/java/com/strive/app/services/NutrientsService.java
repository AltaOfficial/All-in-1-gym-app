package com.strive.app.services;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.enums.GenderType;
import com.strive.app.enums.MainGoal;
import com.strive.app.enums.TrainingExperience;
import com.strive.app.enums.WeightType;

import java.time.LocalDate;
import java.util.Map;

public interface NutrientsService {
    NutrientGoalsDto calculateNutrientGoals(Integer age, Map<LocalDate, Double> weightHistory, Map<LocalDate, Integer> caloriesHistory, WeightType weightType, GenderType sex, Integer heightInInches, Double weightChangeAmount, MainGoal mainGoal, TrainingExperience trainingExperience);
}
