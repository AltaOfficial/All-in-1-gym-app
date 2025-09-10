import * as SecureStore from "expo-secure-store";
import { BodyMetricsLogType } from "../types/BodyMetricsLogType";

export async function getBodyMetrics(
  { latest }: { latest?: boolean } = { latest: false }
): Promise<BodyMetricsLogType | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/bodymetrics/todaysLog?latest=${latest}`,
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as BodyMetricsLogType;
    } else {
      console.log("error", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    return null;
  }
}
