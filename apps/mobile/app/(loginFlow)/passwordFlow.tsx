import { View, Text, TextInput, Pressable, Image } from "react-native";
import LogInWithButton from "../../components/LogInWithButton";
import * as SecureStore from "expo-secure-store";
import { useContext, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import {
  checkAccountNeedsOnboarding,
  OnboardingContext,
} from "../../context/OnboardingContext";

export default function PasswordFlow() {
  const { setOnboardingStepCategory } = useContext(OnboardingContext);
  const [password, setPassword] = useState("");
  const { createAccount, email } = useLocalSearchParams();
  const { setIsSignedIn } = useContext(AuthContext);

  return (
    <View className="flex-1 items-center p-28 dark:bg-black">
      <Text className="font-[HelveticaNeueBoldItalic] text-[3.5rem] text-white mb-24 mt-[2rem]">
        strive.
      </Text>
      <Text className="font-[HelveticaNeue] text-center text-white text-[2rem] mb-10 w-96">
        {createAccount == "true" ? "Create Password" : "Enter Password"}
      </Text>
      <TextInput
        placeholder="Password"
        placeholderTextColor={"#E0E0E0"}
        placeholderClassName="opacity-35"
        className="border font-[HelveticaNeue] text-white border-white rounded-[2rem] w-96 pl-8 py-4 caret-white mb-9"
        onChangeText={setPassword}
        value={password}
      ></TextInput>
      <Pressable
        onPress={async () => {
          if (createAccount == "false") {
            await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/login`, {
              method: "POST",
              body: JSON.stringify({
                email: email.toString().toLowerCase(),
                password: password,
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
              .then(async (data) => {
                console.log(data);
                SecureStore.setItemAsync("jwtToken", data.token);
                await checkAccountNeedsOnboarding(
                  data.user,
                  setOnboardingStepCategory,
                  true
                );
                setIsSignedIn(true);
              });
          } else {
            router.push(
              `/(loginFlow)/(onboardingFlow)/nameFlow?email=${email.toString().toLowerCase()}&password=${password}`
            );
          }
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
