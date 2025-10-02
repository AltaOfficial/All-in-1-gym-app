import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GenericButton from "../../../components/GenericButton";
import { router, useLocalSearchParams } from "expo-router";
import { CreateWorkoutContext } from "../../../context/CreateWorkoutContext";
import { useContext } from "react";
import * as SecureStore from "expo-secure-store";
import Animated, {
  runOnJS,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");

// Swipeable Exercise Item Component
const SwipeableExerciseItem = ({
  exercise,
  index,
  onDelete,
}: {
  exercise: any;
  index: number;
  onDelete: (index: number) => void;
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleDelete = () => {
    onDelete(index);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Allow swiping in both directions
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const threshold = screenWidth * 0.3; // 30% of screen width

      if (Math.abs(event.translationX) > threshold) {
        // Swipe far enough in either direction to delete
        const direction = event.translationX > 0 ? screenWidth : -screenWidth;
        translateX.value = withSpring(direction, {
          damping: 20,
          stiffness: 300,
        });
        opacity.value = withSpring(0, { damping: 20, stiffness: 300 }, () => {
          runOnJS(handleDelete)();
        });
      } else {
        // Snap back to original position
        translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <View className="bg-gray1 rounded-xl p-4 mb-4">
          <Pressable
            className="flex-row items-center"
            onPress={() => {
              router.push(
                `/(app)/(training)/newExercise?exerciseIndex=${index}`
              );
            }}
          >
            {/* Exercise Image */}
            <View className="w-20 h-20 rounded-lg mr-4 items-center justify-center">
              <Image
                source={
                  exercise.exerciseImageUrl
                    ? { uri: exercise.exerciseImageUrl }
                    : require("../../../assets/images/exercise example.png")
                }
                className="w-full h-full"
              />
            </View>

            {/* Exercise Details */}
            <View className="flex-1">
              <Text className="text-white text-base font-[HelveticaNeue] font-bold mb-1">
                {exercise.exerciseName}
              </Text>
              <Text className="text-white text-sm font-[HelveticaNeue] mb-1">
                {exercise.goalSets} sets
              </Text>
              <Text className="text-white text-sm font-[HelveticaNeue] mb-1">
                {exercise.goalReps} reps each
              </Text>
              <Text className="text-gray3 text-xs font-[HelveticaNeue]">
                {exercise.restTimeInSeconds} rest
              </Text>
            </View>
          </Pressable>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const NewWorkout = () => {
  const { workoutId } = useLocalSearchParams();
  const { exercises, clearContext, setWorkoutName, setExercises, workoutName, refreshWorkouts } =
    useContext(CreateWorkoutContext);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-black">
      <ScrollView className="flex-1 px-4">
        {/* Top Navigation and Input Area */}

        {/* Workout Name Input */}
        <View className="mb-6 gap-4 pr-2 flex-row justify-between items-center w-full">
          <TextInput
            placeholder="Workout name"
            placeholderTextColor="#828282"
            className="text-white text-lg h-16 w-[60%] font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
            onChangeText={setWorkoutName}
            value={workoutName}
          />
          <GenericButton
            text="Save"
            onPress={async () => {
              if (workoutName.trim() === "" || exercises.length === 0) {
                console.log("Workout name and exercises are required");
                return;
              }

              let response;
              if (workoutId) {
                response = await fetch(
                  `${process.env.EXPO_PUBLIC_BACKEND_URL}/workouts/update`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${await SecureStore.getItemAsync(
                        "jwtToken"
                      )}`,
                    },
                    body: JSON.stringify({
                      id: workoutId,
                      workoutName: workoutName,
                      exercises: exercises,
                    }),
                  }
                );
              } else {
                response = await fetch(
                  `${process.env.EXPO_PUBLIC_BACKEND_URL}/workouts/create`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${await SecureStore.getItemAsync(
                        "jwtToken"
                      )}`,
                    },
                    body: JSON.stringify({
                      workoutName: workoutName,
                      exercises: exercises,
                    }),
                  }
                );
              }
              if (response?.ok) {
                clearContext();
                refreshWorkouts();
                router.back();
              } else {
                console.log("Workout creation/update failed");
              }
            }}
            className="bg-red-500 py-4 w-[35%]"
            textClassName="text-white text-lg"
          />
        </View>

        {/* Exercise List */}
        {exercises.length > 0 &&
          exercises.map((exercise, index) => (
            <SwipeableExerciseItem
              key={index}
              exercise={exercise}
              index={index}
              onDelete={() =>
                setExercises(exercises.filter((_, i) => i !== index))
              }
            />
          ))}

        {/* Add New Exercise Button */}
        <TouchableOpacity
          onPress={() => {
            router.push("/(app)/(training)/newExercise");
          }}
          className="bg-gray1 rounded-xl p-4 mb-6"
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-white font-[HelveticaNeue]">
              + New Exercise
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewWorkout;
