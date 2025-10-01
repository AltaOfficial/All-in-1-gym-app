import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import CalandarNavbar from "../../components/CalandarNavbar";
import Separator from "../../components/Separator";
import MacroProgressBar from "../../components/MacroProgressBar";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { FoodLogItemType, MealType } from "../../types/foodLogItemType";
import { router } from "expo-router";
import { format } from "date-fns";

const FoodLog = () => {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const [foodLog, setFoodLog] = useState<FoodLogItemType[]>([]);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/foods/foodlog/date`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("jwtToken")}`,
      },
      body: JSON.stringify({
        date: date,
      }),
    }).then(async (res) => {
      if (res.ok) {
        if (res.headers.get("Content-Type") === "application/json") {
          const data = await res.json();
          console.log(data);
          return setFoodLog(data);
        } else {
          return setFoodLog([]);
        }
      }
    });
  }, [date]);

  const dinnerCalories = foodLog
    .filter((item) => item.mealType === MealType.DINNER)
    .reduce((acc, item) => acc + (item.calories || 0), 0);
  const lunchCalories = foodLog
    .filter((item) => item.mealType === MealType.LUNCH)
    .reduce((acc, item) => acc + (item.calories || 0), 0);
  const breakfastCalories = foodLog
    .filter((item) => item.mealType === MealType.BREAKFAST)
    .reduce((acc, item) => acc + (item.calories || 0), 0);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-black">
      <CalandarNavbar
        onDateSelect={(date) => setDate(format(date, "yyyy-MM-dd"))}
      />
      <Separator className="h-[0.4px]" />
      <ScrollView className="flex-1 flex-col">
        <View className="flex-row justify-between items-center px-4 my-3 h-12">
          <View>
            <Text className="text-white text-xl font-[HelveticaNeue] font-bold">
              Breakfast
            </Text>
            {breakfastCalories != 0 && (
              <Text className="text-white text-lg font-[HelveticaNeue]">
                {breakfastCalories.toFixed(0)} cal
              </Text>
            )}
          </View>
          {date === format(new Date(), "yyyy-MM-dd") && (
            <TouchableOpacity
              onPress={() => router.push("/(app)/(nutrition)/logfoodsearch")}
            >
              <Text className="text-primary text-lg font-[HelveticaNeue]">
                Add Food
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Separator className="h-[0.4px]" />
        <View>
          {foodLog
            .filter((item) => item.mealType === MealType.BREAKFAST)
            .map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center px-4 my-3"
              >
                <View>
                  <Text className="text-white text-lg font-[HelveticaNeue]">
                    {item.foodName.length > 28
                      ? item.foodName.substring(0, 25) + "..."
                      : item.foodName}
                  </Text>
                  <Text className="text-gray3 font-[HelveticaNeue]">
                    {item.servingSize}{" "}
                    {item.servings ? `(${item.servings} servings)` : ""}
                  </Text>
                </View>
                <View className="flex-col items-end gap-2">
                  <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
                    {item.calories?.toFixed(0) ?? 0} cal
                  </Text>
                  <Text className="text-gray3 font-[HelveticaNeue]">
                    {new Date(
                      new Date().setHours(
                        parseInt(item.time.split(":")[0]),
                        parseInt(item.time.split(":")[1])
                      )
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
              </View>
            ))}
        </View>
        <Separator className="h-[0.4px]" />
        <View className="flex-row justify-between items-center px-4 my-3 h-12">
          <View>
            <Text className="text-white text-xl font-[HelveticaNeue] font-bold">
              Lunch
            </Text>
            {lunchCalories != 0 && (
              <Text className="text-white text-lg font-[HelveticaNeue]">
                {lunchCalories.toFixed(0)} cal
              </Text>
            )}
          </View>
          {date === format(new Date(), "yyyy-MM-dd") && (
            <TouchableOpacity
              onPress={() => router.push("/(nutrition)/logFoodSearch")}
            >
              <Text className="text-primary text-lg font-[HelveticaNeue]">
                Add Food
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Separator className="h-[0.4px]" />
        <View>
          {foodLog
            .filter((item) => item.mealType === MealType.LUNCH)
            .map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center px-4 my-3"
              >
                <View>
                  <Text className="text-white text-lg font-[HelveticaNeue]">
                    {item.foodName.length > 28
                      ? item.foodName.substring(0, 25) + "..."
                      : item.foodName}
                  </Text>
                  <Text className="text-gray3 font-[HelveticaNeue]">
                    {item.servingSize}{" "}
                    {item.servings ? `(${item.servings} servings)` : ""}
                  </Text>
                </View>
                <View className="flex-col items-end gap-2">
                  <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
                    {item.calories?.toFixed(0) ?? 0} cal
                  </Text>
                  <Text className="text-gray3 font-[HelveticaNeue]">
                    {new Date(
                      new Date().setHours(
                        parseInt(item.time.split(":")[0]),
                        parseInt(item.time.split(":")[1])
                      )
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
              </View>
            ))}
        </View>
        <Separator className="h-[0.4px]" />
        <View className="flex-row justify-between items-center px-4 my-3 h-12">
          <View>
            <Text className="text-white text-xl font-[HelveticaNeue] font-bold">
              Dinner
            </Text>
            {dinnerCalories != 0 && (
              <Text className="text-white text-lg font-[HelveticaNeue]">
                {dinnerCalories.toFixed(0)} cal
              </Text>
            )}
          </View>
          {date === format(new Date(), "yyyy-MM-dd") && (
            <TouchableOpacity
              onPress={() => router.push("/(nutrition)/logFoodSearch")}
            >
              <Text className="text-primary text-lg font-[HelveticaNeue]">
                Add Food
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Separator className="h-[0.4px]" />
        <View>
          {foodLog
            .filter((item) => item.mealType === MealType.DINNER)
            .map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center px-4 my-3"
              >
                <View>
                  <Text className="text-white text-lg font-[HelveticaNeue]">
                    {item.foodName.length > 28
                      ? item.foodName.substring(0, 25) + "..."
                      : item.foodName}
                  </Text>
                  <Text className="text-gray3 font-[HelveticaNeue]">
                    {item.servingSize}{" "}
                    {item.servings ? `(${item.servings} servings)` : ""}
                  </Text>
                </View>
                <View className="flex-col items-end gap-2">
                  <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
                    {item.calories?.toFixed(0) ?? 0} cal
                  </Text>
                  <Text className="text-gray3 font-[HelveticaNeue]">
                    {new Date(
                      new Date().setHours(
                        parseInt(item.time.split(":")[0]),
                        parseInt(item.time.split(":")[1])
                      )
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default FoodLog;
