import { View, Text, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useContext, useState, useEffect } from "react";
import { router } from "expo-router";
import Checkbox from "../../../components/Checkbox";
import {
  OnboardingContext,
  OnboardingStepCategory,
} from "../../../context/OnboardingContext";

export default function TrainingExperienceFlow() {
  const [isBeginner, setIsBeginner] = useState(true);
  const { setOnboardingStepCategory } = useContext(OnboardingContext);

  useEffect(() => {
    setOnboardingStepCategory(OnboardingStepCategory.Training);
  }, [setOnboardingStepCategory]);
  return (
    <View className="flex-1 items-center dark:bg-black">
      <Text className="font-[HelveticaNeue] text-center pt-28 text-white text-[2rem] mt-12 mb-24 w-[30rem]">
        How long have you been training?
      </Text>

      <View className="flex-row gap-24 mb-32">
        <View className="flex-col gap-4">
          <Text className="text-white text-center font-[HelveticaNeue] text-2xl">
            {"Beginner\n(<1 year)"}
          </Text>
          <Checkbox checked={isBeginner} onPress={() => setIsBeginner(true)} />
        </View>
        <View className="flex-col gap-4">
          <Text className="text-white text-center font-[HelveticaNeue] text-2xl">
            {"Intermediate\n(>1 year)"}
          </Text>
          <Checkbox
            checked={!isBeginner}
            onPress={() => setIsBeginner(false)}
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
                trainingExperience: isBeginner ? "BEGINNER" : "INTERMEDIATE",
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
              },
            }
          ).then((res) => {
            if (res.ok) {
              router.push("mainGoalFlow");
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
