import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Checkbox from "./Checkbox";
import { useContext, useEffect, useState } from "react";
import { GroceryListContext } from "../context/GroceryListContext";
import { getGroceryList } from "../services/getGroceryList";
import { GroceryListItemType } from "../types/groceryListItemType";
import { format } from "date-fns";

export default function GroceryListCard() {
  const { refreshGroceryList, getCurrentWeek } = useContext(GroceryListContext);
  const [groceryList, setGroceryList] = useState<GroceryListItemType[]>([]);

  useEffect(() => {
    getGroceryList({
      dateFrom: format(getCurrentWeek()?.weekFrom ?? new Date(), "yyyy-MM-dd"),
      dateTo: format(getCurrentWeek()?.weekTo ?? new Date(), "yyyy-MM-dd"),
    }).then((groceryList) => {
      setGroceryList(groceryList ?? []);
    });
  }, [refreshGroceryList]);

  return (
    <View className="mb-4 px-4 flex-1">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-white font-[HelveticaNeue] text-2xl">
          This Weeks Grocery List
        </Text>
      </View>

      <View
        className={`bg-gray1 h-64 rounded-xl p-4 pt-5 flex-col items-center justify-between`}
      >
        <View className="flex-row items-start gap-4 justify-between w-full">
          <View className="flex-col gap-2">
            {groceryList?.slice(0, 4).map((item) => (
              <View className="flex-row items-center" key={item.id}>
                <Checkbox checked={item.isBought} onPress={() => {}} />
                <Text className="text-white font-[HelveticaNeue]">
                  {item.itemName}
                </Text>
              </View>
            ))}
          </View>
          <View className="flex-col items-center place-self-end place-items-end justify-end align-top">
            <Text className="text-white font-[HelveticaNeue]">Est. Cost:</Text>
            <Text className="text-white font-[HelveticaNeue]">
              $
              {groceryList
                ?.reduce((acc, item) => acc + item.cost * item.quantity, 0)
                .toFixed(2) ?? 0}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(grocery)/groceryList")}
          className="flex-row items-center justify-center mt-4 border-gray2 border rounded-xl py-3 w-full"
        >
          <Text className="text-white font-[HelveticaNeue]">
            View Grocery List
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
