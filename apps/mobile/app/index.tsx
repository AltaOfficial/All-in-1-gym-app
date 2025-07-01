import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import LogInWithButton from "../components/LogInWithButton";
import React from "react";

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center p-28 dark:bg-black">
      <Text className="font-[HelveticaNueueBoldItalic] text-[3.5rem] text-white mb-24">
        strive.
      </Text>
      <Text className="font-[HelveticaNueue] text-white text-[2rem] mb-10">
        Login Or Signup
      </Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={"#E0E0E0"}
        placeholderClassName="opacity-35"
        className="border font-[HelveticaNueue] text-white border-white rounded-[2rem] w-96 pl-8 py-4 caret-white mb-9"
      ></TextInput>
      <Pressable
        onPress={() => console.log("hello")}
        className="bg-[#F84959] w-96 py-4 justify-center align-middle place-content-center place-items-center text-center rounded-[2rem]"
      >
        <Text className="text-white text-center font-[HelveticaNueue] text-lg">
          Continue
        </Text>
      </Pressable>
      <Text className="text-white my-10 text-lg font-[HelveticaNueue]">or</Text>
      <View className="grid gap-4">
        <LogInWithButton text="Continue with Google">
          <Image
            source={require("../assets/images/google logo.png")}
            className="w-10 h-10"
          />
        </LogInWithButton>
        <LogInWithButton text="Continue with Apple">
          <Image
            source={require("../assets/images/apple logo.png")}
            className="w-10 h-10"
          />
        </LogInWithButton>
        <LogInWithButton text="Continue with Facebook">
          <Image
            source={require("../assets/images/facebook logo.png")}
            className="w-10 h-10"
          />
        </LogInWithButton>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
