import * as SecureStore from "expo-secure-store";
import { BodyMetricsLogType } from "../types/BodyMetricsLogType";

export async function getBodyMetricsWithDateRange({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<BodyMetricsLogType[] | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/bodymetrics/logsByDateRange`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as BodyMetricsLogType[];
    } else {
      console.log("error", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    return null;
  }
}
