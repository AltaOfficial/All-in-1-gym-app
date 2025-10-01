import { View, Text, ScrollView } from "react-native";
import GenericButton from "../../../components/GenericButton";
import MacrosBreakdown from "../../../components/MacrosBreakdown";
import TodaysMealBreakdown from "../../../components/TodaysMealBreakdown";
import GroceryListCard from "../../../components/GroceryListCard";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Nutrition() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="flex-row justify-between items-center px-4 pt-2 pb-6">
          <Text className="font-[HelveticaNeueBoldItalic] text-[2.7rem] text-white">
            strive.
          </Text>
          <GenericButton
            text="+ Log Food"
            onPress={() => router.push("/logFoodSearch")}
            className="w-44 py-3"
          />
        </View>
        <MacrosBreakdown />
        <TodaysMealBreakdown />
        <GroceryListCard />

        {/* this weeks grocery list */}
      </ScrollView>
    </SafeAreaView>
  );
}
