import * as SecureStore from "expo-secure-store";
import { MealPlanType } from "../types/mealPlanType";

export async function removeFromMealPlan(
  date: string, // yyyy-MM-dd format
  itemId: string
): Promise<MealPlanType | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/mealplan/remove`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
        body: JSON.stringify({
          date,
          itemId,
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
    console.log("error removing from meal plan", error);
    return null;
  }
}
