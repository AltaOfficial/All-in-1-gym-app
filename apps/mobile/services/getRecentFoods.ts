import * as SecureStore from "expo-secure-store";
import { FoodType } from "../types/foodType";

export async function getRecentFoods(): Promise<FoodType[]> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/foods/recent`,
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.reverse() as FoodType[];
    } else {
      console.log("error", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching recent foods:", error);
    return [];
  }
}
