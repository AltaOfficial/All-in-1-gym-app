import { View, Text, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect, useContext } from "react";
import { router } from "expo-router";
import Checkbox from "../../../components/Checkbox";
import {
  OnboardingContext,
  OnboardingStepCategory,
} from "../../../context/OnboardingContext";

export default function MainGoalFlow() {
  const [mainGoal, setMainGoal] = useState("LOSE_FAT");
  const { setOnboardingStepCategory } = useContext(OnboardingContext);

  useEffect(() => {
    setOnboardingStepCategory(OnboardingStepCategory.Goals);
  }, [setOnboardingStepCategory]);

  return (
    <View className="flex-1 items-center dark:bg-black">
      <Text className="font-[HelveticaNeue] text-center pt-28 text-white text-[2rem] mt-12 mb-24 w-[30rem]">
        What is your main goal right now?
      </Text>

      <View className="flex-row gap-6 mb-32 px-10">
        <View className="flex-col w-1/3 gap-4 ">
          <Text className="text-white text-center font-[HelveticaNeue] text-xl">
            {"🥗\nLose fat"}
          </Text>
          <Checkbox
            checked={mainGoal === "LOSE_FAT"}
            onPress={() => setMainGoal("LOSE_FAT")}
          />
        </View>
        <View className="flex-col w-1/3 gap-4 ">
          <Text className="text-white text-center font-[HelveticaNeue] text-xl">
            {"💪\nMaintain"}
          </Text>
          <Checkbox
            checked={mainGoal === "MAINTAIN"}
            onPress={() => setMainGoal("MAINTAIN")}
          />
        </View>
        <View className="flex-col w-1/3 gap-4 ">
          <Text className="text-white text-center font-[HelveticaNeue] text-xl">
            {"🏋\nBuild muscle"}
          </Text>
          <Checkbox
            checked={mainGoal === "BUILD_MUSCLE"}
            onPress={() => setMainGoal("BUILD_MUSCLE")}
          />
        </View>
      </View>

      <Pressable
        onPress={async () => {
          await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/onboarding/update`,
            {
              method: "POST",
              body: JSON.stringify({
                mainGoal: mainGoal,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
              },
            }
          ).then((res) => {
            if (res.ok) {
              if (mainGoal === "MAINTAIN") {
                router.push("summaryFlow");
              } else {
                router.push(`weeklyWeightChangeFlow?mainGoal=${mainGoal}`);
              }
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
