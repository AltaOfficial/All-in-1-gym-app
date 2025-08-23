import { View, Text, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import ValueSlider from "../../../components/ValueSlider";
import {
  OnboardingContext,
  OnboardingStepCategory,
} from "../../../context/OnboardingContext";
import { useContext } from "react";

export default function AgeFlow() {
  const [age, setAge] = useState(0);
  const { setOnboardingStepCategory } = useContext(OnboardingContext);

  useEffect(() => {
    setOnboardingStepCategory(OnboardingStepCategory.BasicInfo);
  }, [setOnboardingStepCategory]);

  return (
    <View className="flex-1 items-center dark:bg-black">
      <Text className="font-[HelveticaNeue] text-center pt-28 text-white text-[2rem] mt-12 mb-32 w-[30rem]">
        What's your current age?
      </Text>
      <ValueSlider className="mb-10" setValue={setAge} />
      <Pressable
        onPress={async () => {
          await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/onboarding/update`,
            {
              method: "POST",
              body: JSON.stringify({
                age: age,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
              },
            }
          ).then((res) => {
            if (res.ok) {
              router.push("weightFlow");
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
