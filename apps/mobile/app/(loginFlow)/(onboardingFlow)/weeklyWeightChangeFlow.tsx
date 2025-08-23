import { View, Text, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect, useContext } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Checkbox from "../../../components/Checkbox";
import {
  OnboardingContext,
  OnboardingStepCategory,
} from "../../../context/OnboardingContext";
import { getCurrentUser } from "../../../services/getCurrentUser";

export default function WeeklyWeightChangeFlow() {
  const [weeklyWeightChange, setWeeklyWeightChange] = useState(0.5);
  const { onboardingStepCategory, setOnboardingStepCategory } =
    useContext(OnboardingContext);
  const { mainGoal } = useLocalSearchParams();
  const [metric, setMetric] = useState("Lbs");

  useEffect(() => {
    setOnboardingStepCategory(OnboardingStepCategory.Goals);
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        setMetric(currentUser?.weightType || "Lbs");
        setWeeklyWeightChange(currentUser?.weightChangeAmount || 0.5);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    })();
  }, []);

  return (
    <View className="flex-1 items-center dark:bg-black">
      <Text className="font-[HelveticaNeue] text-center pt-28 text-white text-[2rem]  mb-24 w-[30rem]">
        {`How much weight do \nyou want to ${mainGoal === "LOSE_FAT" ? "lose" : "gain"} \neach week?`}
      </Text>

      <View className="flex-col gap-10 mb-32 px-10">
        <View className="flex-row gap-4 ">
          <Checkbox
            checked={weeklyWeightChange === 0.2}
            onPress={() => setWeeklyWeightChange(0.2)}
          />
          <Text className="text-white text-center font-[HelveticaNeue] text-xl">
            {`${mainGoal === "LOSE_FAT" ? "Lose" : "Gain"} 0.2 ${metric === "KGS" ? "Kgs" : "Lbs"} per week`}
          </Text>
        </View>
        <View className="flex-row gap-4 ">
          <Checkbox
            checked={weeklyWeightChange === 0.5}
            onPress={() => setWeeklyWeightChange(0.5)}
          />
          <Text className="text-white text-center font-[HelveticaNeue] text-xl">
            {`${mainGoal === "LOSE_FAT" ? "Lose" : "Gain"} 0.5 ${metric === "KGS" ? "Kgs" : "Lbs"} per week`}
          </Text>
        </View>
        <View className="flex-row gap-4 ">
          <Checkbox
            checked={weeklyWeightChange === 0.8}
            onPress={() => setWeeklyWeightChange(0.8)}
          />
          <Text className="text-white text-center font-[HelveticaNeue] text-xl">
            {`${mainGoal === "LOSE_FAT" ? "Lose" : "Gain"} 0.8 ${metric === "KGS" ? "Kgs" : "Lbs"} per week`}
          </Text>
        </View>
        <View className="flex-row gap-4 ">
          <Checkbox
            checked={weeklyWeightChange === 1.0}
            onPress={() => setWeeklyWeightChange(1.0)}
          />
          <Text className="text-white text-center font-[HelveticaNeue] text-xl">
            {`${mainGoal === "LOSE_FAT" ? "Lose" : "Gain"} 1.0 ${metric === "KGS" ? "Kgs" : "Lbs"} per week`}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={async () => {
          await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/onboarding/update`,
            {
              method: "POST",
              body: JSON.stringify({
                weightChangeAmount: weeklyWeightChange,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
              },
            }
          ).then((res) => {
            if (res.ok) {
              router.push("summary");
              return;
            }
            throw new Error("Failed to move to next step");
          });
        }}
        className="bg-[#F84959] w-96 py-4 justify-center align-middle place-content-center place-items-center text-center rounded-[2rem]"
      >
        <Text className="text-white text-center font-[HelveticaNeue] text-lg">
          Continue
        </Text>
      </Pressable>
    </View>
  );
}
