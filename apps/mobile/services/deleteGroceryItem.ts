import { GroceryListItemType } from "../types/groceryListItemType";
import * as SecureStore from "expo-secure-store";

export async function deleteGroceryItem(
  item: GroceryListItemType,
  dateFrom: Date,
  dateTo: Date,
  groceryList: GroceryListItemType[]
) {
  console.log("deleting item:", item, dateFrom, dateTo, groceryList);
  try {
    console.log("deleting item", item);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/grocerylist/remove`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
        body: JSON.stringify({
          dateFrom: item.groceryListEntityIdDateFrom,
          dateTo: item.groceryListEntityIdDateTo,
          groceryListItemDto: {
            id: item.id,
            itemName: item.itemName,
            quantity: item.quantity,
            cost: item.cost,
            isBought: item.isBought,
          },
        }),
      }
    );

    if (response.ok) {
      return groceryList.filter(
        (listItem: GroceryListItemType) => listItem.id !== item.id
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error deleting grocery item:", error);
    return null;
  }
}
