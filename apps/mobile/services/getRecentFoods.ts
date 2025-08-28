import * as SecureStore from "expo-secure-store";
import { FoodLogItemType } from "../types/foodLogItemType";

export async function getRecentFoods(): Promise<FoodLogItemType[]> {
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
      return data as FoodLogItemType[];
    } else {
      console.log("error", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching recent foods:", error);
    return [];
  }
}
