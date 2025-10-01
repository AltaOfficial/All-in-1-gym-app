import * as SecureStore from "expo-secure-store";
import { NutritionMetrics } from "../types/metricsType";
import { format } from "date-fns";

export async function getDailyMetrics(): Promise<NutritionMetrics | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/metrics/daily`,
      {
        headers: {
          "Content-Type": "application/json",
          Date: format(new Date(), "yyyy-MM-dd"),
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as NutritionMetrics;
    } else {
      console.log("error", await response.text());
      console.log("error", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching daily metrics:", error);
    return null;
  }
}
