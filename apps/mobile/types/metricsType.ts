export interface NutritionMetrics {
  // General
  id: string;
  userId: string;
  currentDay: Date;

  // Calories
  currentCalories: number;
  goalCalories: number;
  burnedCalories: number;

  // Macronutrients
  protein: number;
  goalProtein: number;

  carbohydrates: number;
  goalCarbohydrates: number;

  fat: number;
  goalFat: number;

  // Micronutrients and other nutrients
  fiber: number;
  goalFiber: number;

  sugar: number;
  goalSugar: number;

  // Fat breakdown
  saturatedFat: number;
  goalSaturatedFat: number;

  polyunsaturatedFat: number;
  goalPolyunsaturatedFat: number;

  monounsaturatedFat: number;
  goalMonounsaturatedFat: number;

  transFat: number;
  goalTransFat: number;

  // Minerals and other
  cholesterol: number;
  goalCholesterol: number;

  sodium: number;
  goalSodium: number;

  potassium: number;
  goalPotassium: number;
}