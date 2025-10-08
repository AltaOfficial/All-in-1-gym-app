import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import CalandarNavbar from "../../../components/CalandarNavbar";
import Separator from "../../../components/Separator";
import { useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Checkbox from "../../../components/Checkbox";
import { format, set } from "date-fns";
import { toggleMealPlanItem } from "../../../services/toggleMealPlanItem";
import { MetricsContext } from "../../../context/MetricsContext";
import { MealPlannerContext } from "../../../context/MealPlannerContext";

const MealPlanner = () => {
  const { refreshMetrics } = useContext(MetricsContext);
  const { mealPlan, date, refreshMealPlanner, setDate } =
    useContext(MealPlannerContext);

  useEffect(() => {
    refreshMealPlanner();
  }, [date]);

  const handleToggleItem = async (foodId: string) => {
    const updatedItem = await toggleMealPlanItem(foodId);
    if (updatedItem) {
      refreshMealPlanner();
      refreshMetrics();
    }
  };

  const breakfastItems = mealPlan?.mealPlanItems.filter(
    (item) => item.mealType === "BREAKFAST"
  );
  const lunchItems = mealPlan?.mealPlanItems.filter(
    (item) => item.mealType === "LUNCH"
  );
  const dinnerItems = mealPlan?.mealPlanItems.filter(
    (item) => item.mealType === "DINNER"
  );

  const breakfastCalories = breakfastItems?.reduce(
    (acc, item) => acc + (item.calories || 0),
    0
  );
  const lunchCalories = lunchItems?.reduce(
    (acc, item) => acc + (item.calories || 0),
    0
  );
  const dinnerCalories = dinnerItems?.reduce(
    (acc, item) => acc + (item.calories || 0),
    0
  );

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-black">
      <CalandarNavbar onDateSelect={(selectedDate) => setDate(selectedDate)} />
      <Separator className="h-[0.4px]" />
      <ScrollView className="flex-1 flex-col">
        <View className="flex-row justify-between items-center px-4 my-3 h-12">
          <View>
            <Text className="text-white text-xl font-[HelveticaNeue] font-bold">
              Breakfast
            </Text>
            {breakfastCalories != 0 && (
              <Text className="text-white text-lg font-[HelveticaNeue]">
                {breakfastCalories?.toFixed(0)} cal
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(app)/(nutrition)/logFoodSearch",
                params: {
                  searchType: "mealPlan",
                  mealType: "BREAKFAST",
                  date: format(date, "yyyy-MM-dd"),
                },
              })
            }
          >
            <Text className="text-primary text-lg font-[HelveticaNeue]">
              Add Food
            </Text>
          </TouchableOpacity>
        </View>
        <Separator className="h-[0.4px]" />
        <View>
          {breakfastItems?.map((item) => (
            <View
              key={item.id}
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
                  {item.servingsAmount
                    ? `(${item.servingsAmount} servings)`
                    : ""}
                </Text>
              </View>
              <View className="flex-col items-end gap-2">
                <Checkbox
                  checked={item.isLogged ?? false}
                  onPress={() => handleToggleItem(item.id ?? "")}
                />
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
                {lunchCalories?.toFixed(0)} cal
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(app)/(nutrition)/logFoodSearch",
                params: {
                  searchType: "mealPlan",
                  mealType: "LUNCH",
                  date: format(date, "yyyy-MM-dd"),
                },
              })
            }
          >
            <Text className="text-primary text-lg font-[HelveticaNeue]">
              Add Food
            </Text>
          </TouchableOpacity>
        </View>
        <Separator className="h-[0.4px]" />
        <View>
          {lunchItems?.map((item) => (
            <View
              key={item.id}
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
                  {item.servingsAmount
                    ? `(${item.servingsAmount} servings)`
                    : ""}
                </Text>
              </View>
              <View className="flex-col items-end gap-2">
                <Checkbox
                  checked={item.isLogged ?? false}
                  onPress={() => handleToggleItem(item.id ?? "")}
                />
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
                {dinnerCalories?.toFixed(0)} cal
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(app)/(nutrition)/logFoodSearch",
                params: {
                  searchType: "mealPlan",
                  mealType: "DINNER",
                  date: format(date, "yyyy-MM-dd"),
                },
              })
            }
          >
            <Text className="text-primary text-lg font-[HelveticaNeue]">
              Add Food
            </Text>
          </TouchableOpacity>
        </View>
        <Separator className="h-[0.4px]" />
        <View>
          {dinnerItems?.map((item) => (
            <View
              key={item.id}
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
                  {item.servingsAmount
                    ? `(${item.servingsAmount} servings)`
                    : ""}
                </Text>
              </View>
              <View className="flex-col items-end gap-2">
                <Checkbox
                  checked={item.isLogged ?? false}
                  onPress={() => handleToggleItem(item.id ?? "")}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default MealPlanner;
