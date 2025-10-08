import { FoodType } from "./foodType";

export type MealPlanType = {
  id: {
    userId: string;
    date: string; // yyyy-MM-dd format
  };
  userId: string;
  mealPlanItems: FoodType[];
};
