import { View, Text, TextInput, Pressable, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import ValueSlider from "../../../components/ValueSlider";
import WeightMetricSelector from "../../../components/WeightMetricSelector";
import {
  OnboardingContext,
  OnboardingStepCategory,
} from "../../../context/OnboardingContext";
import { useContext } from "react";

export default function WeightFlow() {
  const [weight, setWeight] = useState(0);
  const [isLbs, setIsLbs] = useState(true);
  const { setOnboardingStepCategory } = useContext(OnboardingContext);

  useEffect(() => {
    setOnboardingStepCategory(OnboardingStepCategory.BasicInfo);
  }, [setOnboardingStepCategory]);

  return (
    <View className="flex-1 items-center dark:bg-black">
      <Text className="font-[HelveticaNeue] text-center pt-28 text-white text-[2rem] mt-12 mb-32 w-[30rem]">
        What's your current weight?
      </Text>
      <ValueSlider className="mb-10" setValue={setWeight} />
      <WeightMetricSelector
        className="mb-16"
        isLbs={isLbs}
        setIsLbs={setIsLbs}
      />
      <Pressable
        onPress={async () => {
          await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/onboarding/update`,
            {
              method: "POST",
              body: JSON.stringify({
                weight: weight,
                weightType: isLbs ? "LBS" : "KGS",
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
              },
            }
          ).then((res) => {
            if (res.ok) {
              router.push("heightFlow");
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
