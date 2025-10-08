import * as SecureStore from "expo-secure-store";
import { MealPlanType } from "../types/mealPlanType";
import { FoodType } from "../types/foodType";

export async function addToMealPlan(
  date: string, // yyyy-MM-dd format
  mealPlanItem: FoodType
): Promise<MealPlanType | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/mealplan/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
        body: JSON.stringify({
          date,
          mealPlanItemDto: mealPlanItem,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as MealPlanType;
    } else {
      console.log("error", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.log("error adding to meal plan", error);
    return null;
  }
}
