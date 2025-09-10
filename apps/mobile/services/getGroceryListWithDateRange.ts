import * as SecureStore from "expo-secure-store";
import { GroceryListItemType } from "../types/groceryListItemType";
import { format } from "date-fns";

export async function getGroceryListWithDateRange({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<GroceryListItemType[] | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/grocerylist/logsByDateRange`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
        body: JSON.stringify({
          dateFrom: startDate,
          dateTo: endDate,
        }),
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
    return null;
  }
}
