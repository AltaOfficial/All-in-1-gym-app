import * as SecureStore from "expo-secure-store";
import { RecipeType } from "../types/recipeType";

export async function getUserRecipes(): Promise<RecipeType[]> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/recipes/userrecipes`,
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as RecipeType[];
    } else {
      console.log("error", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching user foods:", error);
    return [];
  }
}
