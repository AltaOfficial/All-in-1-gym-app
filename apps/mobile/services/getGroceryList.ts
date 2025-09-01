import * as SecureStore from "expo-secure-store";
import { GroceryListItemType } from "../types/groceryListItemType";

export async function getGroceryList({ dateFrom, dateTo }: { dateFrom: Date, dateTo: Date }): Promise<GroceryListItemType[] | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/grocerylist`,
      {
        method: 'POST',
        body: JSON.stringify({ dateFrom, dateTo }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as GroceryListItemType[];
    } else {
      console.log("error", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching grocery list:", error);
    return null;
  }
}
