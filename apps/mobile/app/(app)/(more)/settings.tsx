import { Text, TextInput, View, ScrollView } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import GenericButton from "../../../components/GenericButton";
import { MetricsContext } from "../../../context/MetricsContext";

// Same choices as onboarding's weekly change screen
const WEEKLY_CHANGE_OPTIONS = [0.2, 0.5, 0.8, 1.0];
const DEFAULT_WEEKLY_CHANGE = 0.5;

export default function Settings() {
  const { refreshMetrics } = useContext(MetricsContext);
  const [mainGoal, setMainGoal] = useState("LOSE_FAT");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [weightType, setWeightType] = useState("LBS");
  const [weeklyChange, setWeeklyChange] = useState(DEFAULT_WEEKLY_CHANGE);
  // What's saved on the server, so switching back to the saved goal restores its rate
  const [savedGoal, setSavedGoal] = useState<string | null>(null);
  const [savedWeeklyChange, setSavedWeeklyChange] = useState<number | null>(null);
  // AUTO calculates calories from the user's logs; CUSTOM fixes them and builds macros from it
  const [calorieMode, setCalorieMode] = useState<"AUTO" | "CUSTOM">("AUTO");
  const [customCalories, setCustomCalories] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGoalChange = (newGoal: string) => {
    setMainGoal(newGoal);
    // A rate picked for losing shouldn't carry over to gaining, so reset it on a goal switch
    setWeeklyChange(
      newGoal === savedGoal && savedWeeklyChange
        ? savedWeeklyChange
        : DEFAULT_WEEKLY_CHANGE
    );
  };

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
          if (userData.mainGoal) {
            setMainGoal(userData.mainGoal);
            setSavedGoal(userData.mainGoal);
          }
          if (userData.weightChangeAmount) {
            setWeeklyChange(userData.weightChangeAmount);
            setSavedWeeklyChange(userData.weightChangeAmount);
          }
          if (userData.weightType) setWeightType(userData.weightType);
          if (userData.weight) setWeight(userData.weight.toString());
          if (userData.heightInInches)
            setHeight(userData.heightInInches.toString());
          if (userData.age) setAge(userData.age.toString());
          if (userData.customCalorieGoal) {
            setCalorieMode("CUSTOM");
            setCustomCalories(userData.customCalorieGoal.toString());
          } else if (userData.goalCalories) {
            // Start a custom goal from the current one if they switch over
            setCustomCalories(userData.goalCalories.toString());
          }
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
    setErrorMessage(null);
    const calories = parseInt(customCalories);
    if (calorieMode === "CUSTOM" && !(calories > 0)) {
      setErrorMessage("Enter a daily calorie goal.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("jwtToken");

      const requestBody: {
        mainGoal?: string;
        weight?: number;
        heightInInches?: number;
        age?: number;
        weightChangeAmount?: number;
        customCalorieGoal?: number;
      } = {};

      if (mainGoal) requestBody.mainGoal = mainGoal;
      if (mainGoal !== "MAINTAIN") requestBody.weightChangeAmount = weeklyChange;
      // 0 tells the server to go back to automatic calories
      requestBody.customCalorieGoal = calorieMode === "CUSTOM" ? calories : 0;
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
        // The server explains what's wrong, e.g. a calorie goal out of range
        setErrorMessage((await response.text()) || "Couldn't save your settings.");
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
                onValueChange={(itemValue) => handleGoalChange(itemValue)}
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

          {/* Weekly Change Dropdown (Maintain has no rate, and a custom calorie goal ignores it) */}
          {mainGoal !== "MAINTAIN" && calorieMode === "AUTO" && (
            <View className="flex-col gap-2 mt-4">
              <Text className="text-white text-lg font-[HelveticaNeue]">
                Weekly Change
              </Text>
              <View
                className="border-gray2 border rounded-2xl overflow-hidden h-14 justify-center"
                style={{ backgroundColor: "black" }}
              >
                <Picker
                  selectedValue={weeklyChange}
                  onValueChange={(itemValue) => setWeeklyChange(itemValue)}
                  style={{
                    color: "white",
                    backgroundColor: "black",
                  }}
                  dropdownIconColor="white"
                  mode="dropdown"
                >
                  {WEEKLY_CHANGE_OPTIONS.map((option) => (
                    <Picker.Item
                      key={option}
                      label={`${mainGoal === "LOSE_FAT" ? "Lose" : "Gain"} ${option.toFixed(1)} ${weightType === "KGS" ? "Kgs" : "Lbs"} per week`}
                      value={option}
                      style={{ backgroundColor: "black", color: "white" }}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {/* Calorie Goal: automatic, or a fixed number the macros are built from */}
          <View className="flex-col gap-2 mt-4">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Calorie Goal
            </Text>
            <View
              className="border-gray2 border rounded-2xl overflow-hidden h-14 justify-center"
              style={{ backgroundColor: "black" }}
            >
              <Picker
                selectedValue={calorieMode}
                onValueChange={(itemValue) => setCalorieMode(itemValue)}
                style={{
                  color: "white",
                  backgroundColor: "black",
                }}
                dropdownIconColor="white"
                mode="dropdown"
              >
                <Picker.Item
                  label="Automatic (from your logs)"
                  value="AUTO"
                  style={{ backgroundColor: "black", color: "white" }}
                />
                <Picker.Item
                  label="Custom"
                  value="CUSTOM"
                  style={{ backgroundColor: "black", color: "white" }}
                />
              </Picker>
            </View>
            {calorieMode === "CUSTOM" && (
              <>
                <TextInput
                  value={customCalories}
                  onChangeText={(text) => setCustomCalories(text)}
                  placeholder="Daily calories"
                  keyboardType="numeric"
                  placeholderTextColor="#828282"
                  className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
                />
                <Text className="text-gray3 text-sm font-[HelveticaNeue]">
                  Protein, carbs and fat are calculated from this number.
                </Text>
              </>
            )}
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
        {errorMessage && (
          <Text className="text-red-500 text-sm font-[HelveticaNeue] mb-2">
            {errorMessage}
          </Text>
        )}
        <GenericButton
          text="Save Changes"
          onPress={handleSaveChanges}
          className="w-full"
        />
      </View>
    </SafeAreaView>
  );
}
