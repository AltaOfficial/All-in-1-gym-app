import { View, Text, Pressable, TouchableOpacity } from "react-native";
import CalendarIcon from "../assets/icons/CalendarIcon";
import GenericButton from "./GenericButton";
import MealBreakdownCard from "./MealBreakdownCard";
import { useState, useContext, useEffect } from "react";
import { router } from "expo-router";
import { MealPlannerContext } from "../context/MealPlannerContext";
import { MealType } from "../types/foodLogItemType";
import { useIsFocused } from "@react-navigation/native";

export default function TodaysMealBreakdown() {
  const [mealType, setMealType] = useState<MealType>(MealType.BREAKFAST);
  const { mealPlan, date, setDate, refreshMealPlanner } =
    useContext(MealPlannerContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour == 0 || currentHour < 11) {
      setMealType(MealType.BREAKFAST);
    } else if (currentHour == 11 || currentHour < 16) {
      setMealType(MealType.LUNCH);
    } else {
      setMealType(MealType.DINNER);
    }
  }, []);

  useEffect(() => {
    console.log("isFocused", isFocused);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    console.log("isToday", isToday);
    console.log("date", date);
    console.log("today", today);
    if (isFocused && !isToday) {
      console.log("refreshing");
      setDate(today);
    }
  }, [isFocused]);

  return (
    <View className="px-4 pb-12 pt-2">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-white font-[HelveticaNeue] text-2xl">
          Todays Meal Plan
        </Text>
        <Pressable
          onPress={() => {
            router.push("/(app)/(nutrition)/mealPlanner");
          }}
        >
          <CalendarIcon height={28} width={28} fill="white" />
        </Pressable>
      </View>
      <View className="flex-row text-pretty gap-3 items-center">
        <GenericButton
          className={`py-2 px-1 flex-1 ${
            mealType == MealType.BREAKFAST ? "!bg-primary" : "!bg-[#27272A]"
          }`}
          onPress={() => {
            setMealType(MealType.BREAKFAST);
          }}
          text="Breakfast"
          textClassName={`${
            mealType == MealType.BREAKFAST ? "!text-white" : "!text-white/70"
          }`}
          opacityEnabled={false}
        />
        <GenericButton
          className={`py-2 px-1 flex-1 ${
            mealType == MealType.LUNCH ? "!bg-primary" : "!bg-[#27272A]"
          }`}
          onPress={() => {
            setMealType(MealType.LUNCH);
          }}
          text="Lunch"
          opacityEnabled={false}
          textClassName={`${
            mealType == MealType.LUNCH ? "!text-white" : "!text-white/70"
          }`}
        />
        <GenericButton
          className={`py-2 px-1 flex-1 ${
            mealType == MealType.DINNER ? "!bg-primary" : "!bg-[#27272A]"
          }`}
          onPress={() => {
            setMealType(MealType.DINNER);
          }}
          text="Dinner"
          textClassName={`${
            mealType == MealType.DINNER ? "!text-white" : "!text-white/70"
          }`}
          opacityEnabled={false}
        />
        <GenericButton
          className={`py-2 px-1 flex-1 ${
            mealType == MealType.SNACK ? "!bg-primary" : "!bg-[#27272A]"
          }`}
          onPress={() => {
            setMealType(MealType.SNACK);
          }}
          text="Snacks"
          textClassName={`${
            mealType == MealType.SNACK ? "!text-white" : "!text-white/70"
          }`}
          opacityEnabled={false}
        />
      </View>

      <View className="mt-4 gap-3">
        {mealPlan?.mealPlanItems
          .filter((item) => item.mealType === mealType)
          .map((item) => (
            <MealBreakdownCard
              foodId={item.id!}
              key={item.id}
              protein={item.protein || 0}
              carbs={item.carbohydrates || 0}
              fat={item.fat || 0}
              name={item.foodName}
              calories={item.calories || 0}
              subLabel={item.foodBrandName || ""}
            />
          ))}
        {mealPlan?.mealPlanItems.filter((item) => item.mealType === mealType)
          .length == 0 && (
          <Text className="text-white text-lg font-[HelveticaNeue] text-center mx-4 my-8">
            No meals planned for this section of the day
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          router.push("/(app)/(nutrition)/mealPlanner");
        }}
      >
        <View className="flex-row items-center justify-center mt-4 border-gray2 border rounded-xl py-3">
          <Text className="text-white font-[HelveticaNeue] text-base">
            + Add Item
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
