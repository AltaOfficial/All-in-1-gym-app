import { FoodType } from "./foodType";

export interface RecipeType {
  id: string;
  userid: string;

  recipeName: string;
  servingsAmount: number;

  ingredients: FoodType[];
}
