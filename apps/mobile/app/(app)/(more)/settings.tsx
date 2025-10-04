import { Text, TextInput, View, ScrollView } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import GenericButton from "../../../components/GenericButton";
import { MetricsContext } from "../../../context/MetricsContext";

export default function Settings() {
  const { refreshMetrics } = useContext(MetricsContext);
  const [mainGoal, setMainGoal] = useState("LOSE_FAT");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current user data on mount
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwtToken");
        const today = new Date().toISOString().split("T")[0];

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Date: today,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          if (userData.mainGoal) setMainGoal(userData.mainGoal);
          if (userData.weight) setWeight(userData.weight.toString());
          if (userData.heightInInches)
            setHeight(userData.heightInInches.toString());
          if (userData.age) setAge(userData.age.toString());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwtToken");

      const requestBody: {
        mainGoal?: string;
        weight?: number;
        heightInInches?: number;
        age?: number;
      } = {};

      if (mainGoal) requestBody.mainGoal = mainGoal;
      if (weight) requestBody.weight = parseInt(weight);
      if (height) requestBody.heightInInches = parseInt(height);
      if (age) requestBody.age = parseInt(age);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        await refreshMetrics();
        router.back();
      } else {
        console.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white font-[HelveticaNeue]">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="px-4 pb-32">
          <Text className="text-white text-3xl font-[HelveticaNeue] mt-6 mb-8">
            Settings
          </Text>

          {/* Main Goal Dropdown */}
          <View className="flex-col gap-2 mt-4">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Main Goal
            </Text>
            <View
              className="border-gray2 border rounded-2xl overflow-hidden h-14 justify-center"
              style={{ backgroundColor: "black" }}
            >
              <Picker
                selectedValue={mainGoal}
                onValueChange={(itemValue) => setMainGoal(itemValue)}
                style={{
                  color: "white",
                  backgroundColor: "black",
                }}
                dropdownIconColor="white"
                mode="dropdown"
              >
                <Picker.Item
                  label="Lose Fat"
                  value="LOSE_FAT"
                  style={{ backgroundColor: "black", color: "white" }}
                />
                <Picker.Item
                  label="Maintain"
                  value="MAINTAIN"
                  style={{ backgroundColor: "black", color: "white" }}
                />
                <Picker.Item
                  label="Build Muscle"
                  value="BUILD_MUSCLE"
                  style={{ backgroundColor: "black", color: "white" }}
                />
              </Picker>
            </View>
          </View>

          {/* Weight Input */}
          <View className="flex-col gap-2 mt-4">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Initial Weight
            </Text>
            <TextInput
              value={weight}
              onChangeText={(text) => setWeight(text)}
              placeholder="Enter weight"
              keyboardType="numeric"
              placeholderTextColor="#828282"
              className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
            />
          </View>

          {/* Height Input */}
          <View className="flex-col gap-2 mt-4">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Height (inches)
            </Text>
            <TextInput
              value={height}
              onChangeText={(text) => setHeight(text)}
              placeholder="Enter height in inches"
              keyboardType="numeric"
              placeholderTextColor="#828282"
              className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
            />
          </View>

          {/* Age Input */}
          <View className="flex-col gap-2 mt-4">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Age
            </Text>
            <TextInput
              value={age}
              onChangeText={(text) => setAge(text)}
              placeholder="Enter age"
              keyboardType="numeric"
              placeholderTextColor="#828282"
              className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Save Button */}
      <View className="bg-black px-4 pb-8 pt-4">
        <GenericButton
          text="Save Changes"
          onPress={handleSaveChanges}
          className="w-full"
        />
      </View>
    </SafeAreaView>
  );
}
