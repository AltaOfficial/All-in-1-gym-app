import * as SecureStore from "expo-secure-store";
import { WorkoutType } from "../types/ExerciseTypes";

export async function getUserWorkouts(): Promise<WorkoutType[]> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/workouts/all`,
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as WorkoutType[];
    } else {
      console.log("error", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching user workouts:", error);
    return [];
  }
}
