import { View, Text, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect, useContext } from "react";
import { router } from "expo-router";
import {
  OnboardingContext,
  OnboardingStepCategory,
} from "../../../context/OnboardingContext";
import { getCurrentUser } from "../../../services/getCurrentUser";
import { AuthContext } from "../../../context/AuthContext";

export default function Summary() {
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const { setOnboardingStepCategory } = useContext(OnboardingContext);
  const { setIsSignedIn } = useContext(AuthContext);

  useEffect(() => {
    setOnboardingStepCategory(OnboardingStepCategory.Goals);
  }, [setOnboardingStepCategory]);

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        setDailyCalorieGoal(currentUser?.goalCalories || 2000);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);
  return (
    <View className="flex-1 items-center dark:bg-black px-8 pt-24">
      <Text className="font-[HelveticaNeueBoldItalic] text-[3.5rem] text-white mb-24">
        strive.
      </Text>
      <Text className="font-[HelveticaNeue] text-center text-white text-[2rem] mb-4">
        Account Created!
      </Text>
      <Text className="text-white text-center font-[HelveticaNeue] text-lg mb-8">
        Your daily net calorie goal is:
      </Text>
      <Text className="font-[HelveticaNeue] mb-36">
        <Text className="text-[#00D4FF] text-center text-5xl">
          {dailyCalorieGoal}
        </Text>
        <Text className="text-white"> Calories</Text>
      </Text>
      <Pressable
        onPress={() => {
          setIsSignedIn(true);
          router.push("/(app)");
        }}
        className="bg-[#F84959] w-96 py-4 justify-center align-middle place-content-center place-items-center text-center rounded-[2rem]"
      >
        <Text className="text-white text-center font-[HelveticaNeue] text-lg">
          Finish
        </Text>
      </Pressable>
    </View>
  );
}
