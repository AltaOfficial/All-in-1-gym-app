import * as SecureStore from "expo-secure-store";
import User from "../types/userType";
import { format } from "date-fns";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/me`,
      {
        headers: {
          Date: format(new Date(), "yyyy-MM-dd"),
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as User;
    } else {
      console.log("error", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
