import { View, Text, TextInput, Pressable, Image } from "react-native";
import LogInWithButton from "../../components/LogInWithButton";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { router } from "expo-router";

export default function UsernameFlow() {
  const [email, setEmail] = useState("");

  return (
    <View className="flex-1 items-center p-28 dark:bg-black">
      <Text className="font-[HelveticaNeueBoldItalic] text-[3.5rem] text-white mb-24 mt-[2rem]">
        strive.
      </Text>
      <Text className="font-[HelveticaNeue] text-white text-[2rem] mb-10">
        Login Or Signup
      </Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={"#E0E0E0"}
        placeholderClassName="opacity-35"
        className="border font-[HelveticaNeue] text-white border-white rounded-[2rem] w-96 pl-8 py-4 caret-white mb-9"
        onChangeText={setEmail}
        value={email}
      ></TextInput>
      <Pressable
        onPress={async () => {
          if (email.trim().length == 0) {
            return;
          }
          console.log("email", email);
          await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/validate/email`,
            {
              method: "POST",
              body: JSON.stringify({
                email: email.trim(),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then(async (res) => {
            if (res.ok) {
              const bodyText = await res.text();
              router.push(
                `/(loginFlow)/passwordFlow?createAccount=${!(bodyText == "true")}&email=${email}`
              );
            } else {
              throw new Error("Failed to validate email");
            }
          });
        }}
        className="bg-[#F84959] w-96 py-4 justify-center align-middle place-content-center place-items-center text-center rounded-[2rem]"
      >
        <Text className="text-white text-center font-[HelveticaNeue] text-lg">
          Continue
        </Text>
      </Pressable>
      <Text className="text-white my-10 text-lg font-[HelveticaNeue]">or</Text>
      <View className="grid gap-4">
        <LogInWithButton text="Continue with Google">
          <Image
            source={require("../../assets/images/google logo.png")}
            className="w-10 h-10"
          />
        </LogInWithButton>
        <LogInWithButton text="Continue with Apple">
          <Image
            source={require("../../assets/images/apple logo.png")}
            className="w-10 h-10"
          />
        </LogInWithButton>
        <LogInWithButton text="Continue with Facebook">
          <Image
            source={require("../../assets/images/facebook logo.png")}
            className="w-10 h-10"
          />
        </LogInWithButton>
      </View>
    </View>
  );
}
