import { View, Text, TextInput, Pressable, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useContext, useState, useEffect } from "react";
import { router } from "expo-router";
import ValueSlider from "../../../components/ValueSlider";
import WeightMetricSelector from "../../../components/WeightMetricSelector";
import Checkbox from "../../../components/Checkbox";
import {
  OnboardingContext,
  OnboardingStepCategory,
} from "../../../context/OnboardingContext";

export default function GenderFlow() {
  const [isMale, setIsMale] = useState(true);
  const { setOnboardingStepCategory } = useContext(OnboardingContext);

  useEffect(() => {
    setOnboardingStepCategory(OnboardingStepCategory.BasicInfo);
  }, [setOnboardingStepCategory]);

  return (
    <View className="flex-1 items-center dark:bg-black">
      <Text className="font-[HelveticaNeue] text-center pt-28 text-white text-[2rem] mt-12 mb-24 w-[30rem]">
        What's your sex?
      </Text>

      <View className="flex-row gap-24 mb-32">
        <View className="flex-col gap-4">
          <Text className="text-white text-center font-[HelveticaNeue] text-2xl">
            Male
          </Text>
          <Checkbox checked={isMale} onPress={() => setIsMale(true)} />
        </View>
        <View className="flex-col gap-4">
          <Text className="text-white text-center font-[HelveticaNeue] text-2xl">
            Female
          </Text>
          <Checkbox checked={!isMale} onPress={() => setIsMale(false)} />
        </View>
      </View>

      <Pressable
        onPress={async () => {
          await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/onboarding/update`,
            {
              method: "POST",
              body: JSON.stringify({
                sexType: isMale ? "MALE" : "FEMALE",
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
              },
            }
          ).then((res) => {
            if (res.ok) {
              router.push("trainingExperienceFlow");
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
