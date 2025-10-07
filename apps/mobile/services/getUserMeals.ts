import * as SecureStore from "expo-secure-store";
import { MealType } from "../types/mealType";

export async function getUserMeals(): Promise<MealType[]> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/meals/usermeals`,
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as MealType[];
    } else {
      console.log("error", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching user meals:", error);
    return [];
  }
}
