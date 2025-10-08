import * as SecureStore from "expo-secure-store";
import { MealPlanType } from "../types/mealPlanType";

export async function getMealPlan(
  date: string // yyyy-MM-dd format
): Promise<MealPlanType | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/mealplan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
        body: JSON.stringify({ date }),
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
    console.log("error fetching meal plan", error);
    return null;
  }
}
