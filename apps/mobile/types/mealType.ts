import { FoodType } from "./foodType";

export interface MealType {
  id: string;
  userid: string;
  mealImageUrl?: string;

  mealName: string;
  servingsAmount: number;

  foodItems: FoodType[];
}
