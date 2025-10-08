import * as SecureStore from "expo-secure-store";

export async function getRecentBodyMetricPhotos(
  limit: number = 3
): Promise<string[]> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/bodymetrics/recentPhotos?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as string[];
    } else {
      console.log("error", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.log("error fetching recent photos", error);
    return [];
  }
}
