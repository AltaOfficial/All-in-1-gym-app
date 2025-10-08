import * as SecureStore from "expo-secure-store";
import { FoodType } from "../types/foodType";

export async function toggleMealPlanItem(
  foodId: string
): Promise<FoodType | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/mealplan/toggle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
        body: JSON.stringify({
          foodId,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as FoodType;
    } else {
      console.log("error", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.log("error toggling meal plan item", error);
    return null;
  }
}
