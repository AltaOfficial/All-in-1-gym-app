import { MealType } from "./foodLogItemType";

export interface FoodType {
  id?: string; // UUID

  userCreatedById?: string;
  mealConnectedToId?: string;
  mealPlanConnectedToId?: string;
  recipeConnectedToId?: string;
  inUserRecentsId?: string;

  foodName: string;
  foodBrandName?: string;
  foodBrandOwner?: string;

  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  saturatedFat?: number;
  polyunsaturatedFat?: number;
  monounsaturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  potassium?: number;

  servingSize?: number;
  servingUnit?: string;
  householdServingText?: string;

  foodImageUrl?: string;
  createdAt?: string; // ISO datetime
  isLogged?: boolean;
  mealType?: MealType;
  servingsAmount?: number;
}
