import * as SecureStore from "expo-secure-store";
import { WorkoutLogType } from "../types/ExerciseTypes";

export async function getWorkoutHistory(
  workoutId: string
): Promise<WorkoutLogType[]> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/workout-log/history?workoutId=${workoutId}`,
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data as WorkoutLogType[];
    } else {
      console.log("error", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching workout history:", error);
    return [];
  }
}
