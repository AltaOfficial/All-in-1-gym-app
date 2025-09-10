import { GroceryListItemType } from "../types/groceryListItemType";

export function totalFoodExpenses(data: GroceryListItemType[]) {
  if (data.length === 0) return 0;
  return data.reduce(
    (acc, groceryListItem) =>
      (acc += groceryListItem.cost * groceryListItem.quantity),
    0
  );
}
