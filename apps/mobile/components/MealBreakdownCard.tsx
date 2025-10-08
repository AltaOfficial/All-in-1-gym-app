import { View, Text, Pressable, Image } from "react-native";
import { router } from "expo-router";
import Checkbox from "./Checkbox";
import { toggleMealPlanItem } from "../services/toggleMealPlanItem";

export default function MealBreakdownCard({
  foodId,
  imgUrl,
  protein,
  carbs,
  fat,
  name,
  calories,
  subLabel,
}: {
  foodId: string;
  imgUrl?: string;
  protein: number;
  carbs: number;
  fat: number;
  name: string;
  calories: number;
  subLabel: string;
}) {
  return (
    <Pressable onPress={() => router.push("/(app)/(nutrition)/mealPlanner")}>
      <View className={`bg-gray1 rounded-2xl p-4 flex-row justify-between`}>
        <View className="flex-row">
          {imgUrl && (
            <Image
              source={{ uri: imgUrl }}
              className="w-[27%] rounded-xl h-full object-cover mr-4"
            />
          )}
          <View className="flex-col gap-4">
            <View className="flex-col items-start gap-2">
              <Text className="text-white text-lg">
                {`${name}`.length > 22 && imgUrl
                  ? `${`${name}`.slice(0, 22).trim()}...`
                  : `${name}`.length > 22
                  ? `${`${name}`.slice(0, 28).trim()}...`
                  : `${name}`}
              </Text>
              <Text className="text-white/50 text-sm">
                {`${calories} cal, ${subLabel}`.length > 30 && imgUrl
                  ? `${`${calories} cal, ${subLabel}`.slice(0, 30).trim()}...`
                  : `${calories.toFixed(0)} cal, ${subLabel}`}
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-protein text-xs bg-gray2 p-2 px-3 rounded-full">
                  P: {protein.toFixed(0)}g
                </Text>
                <Text className="text-carbs text-xs bg-gray2 p-2 px-3 rounded-full">
                  C: {carbs.toFixed(0)}g
                </Text>
                <Text className="text-fat text-xs bg-gray2 p-2 px-3 rounded-full">
                  F: {fat.toFixed(0)}g
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Checkbox
          checked={false}
          onPress={() => {
            toggleMealPlanItem(foodId);
          }}
        />
      </View>
    </Pressable>
  );
}
