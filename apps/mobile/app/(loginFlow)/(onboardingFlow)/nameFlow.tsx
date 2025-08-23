import { View, Text, TextInput, Pressable, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect, useContext } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  OnboardingContext,
  OnboardingStepCategory,
} from "../../../context/OnboardingContext";

export default function NameFlow() {
  const [name, setName] = useState("");
  const { email, password } = useLocalSearchParams();
  const { setOnboardingStepCategory } = useContext(OnboardingContext);

  useEffect(() => {
    setOnboardingStepCategory(OnboardingStepCategory.BasicInfo);
  }, [setOnboardingStepCategory]);
  return (
    <View className="flex-1 items-center p-28 dark:bg-black">
      <Text className="font-[HelveticaNeue] text-center  text-white text-[2rem] mb-10">
        Enter Name
      </Text>
      <TextInput
        placeholder="Name"
        placeholderTextColor={"#E0E0E0"}
        placeholderClassName="opacity-35"
        className="border font-[HelveticaNeue] text-white border-white rounded-[2rem] w-96 pl-8 py-4 caret-white mb-9"
        onChangeText={setName}
        value={name}
      ></TextInput>
      <Pressable
        onPress={async () => {
          await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/signup`, {
            method: "POST",
            body: JSON.stringify({
              email: email.toString().toLowerCase().trim(),
              name: name.trim(),
              password: password.toString().trim(),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
              if (res.ok) {
                return res.json();
              }
              throw new Error("Failed to login");
            })
            .then((data) => {
              SecureStore.setItemAsync("jwtToken", data.token);
              router.push("ageFlow");
            });
        }}
        className="bg-[#F84959] w-96 py-4 justify-center align-middle place-content-center place-items-center text-center rounded-[2rem]"
      >
        <Text className="text-white text-center font-[HelveticaNeue] text-lg">
          Next
        </Text>
      </Pressable>
      <Text className="text-[#828282] text-center font-[HelveticaNeue] mt-5 w-96">
        This appears on your Strive profile.
      </Text>
    </View>
  );
}
