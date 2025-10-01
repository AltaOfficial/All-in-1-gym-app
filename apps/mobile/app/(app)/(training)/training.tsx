import { View, Text, Pressable } from "react-native";
import GenericButton from "../../../components/GenericButton";
import Seperator from "../../../components/Separator";
import WorkoutListItem from "../../../components/WorkoutListItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { WorkoutType } from "../../../types/ExerciseTypes";
import { getUserWorkouts } from "../../../services/getUserWorkouts";
import { CreateWorkoutContext } from "../../../context/CreateWorkoutContext";
import { useContext } from "react";
import * as SecureStore from "expo-secure-store";
import ChevronRightIcon from "../../../assets/icons/ChevronRightIcon";
import { WorkoutContext } from "../../../context/WorkoutContext";

export default function Training() {
  const { clearContext, setWorkoutName, setExercises, workoutName, workouts, setWorkouts } =
    useContext(CreateWorkoutContext);
  const { setWorkout } = useContext(WorkoutContext);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-black">
      <View className="p-2">
        <View className="flex-row justify-between items-center">
          <GenericButton
            text="+ New Workout"
            className="w-52 h-13 py-3"
            onPress={() => {
              clearContext();
              router.push("/(training)/newWorkout");
            }}
          />
          <View className="flex-row items-center gap-2 h-13">
            <Pressable
              onPress={() => {
                router.push("/(training)/workoutHistory");
              }}
              className="flex-row items-center gap-2"
            >
              <Text className="text-white text-lg font-[HelveticaNeue]">
                Workout History
              </Text>
              <ChevronRightIcon height={20} width={20} fill="white" />
            </Pressable>
          </View>
        </View>
        <Seperator className="h-[0.5px] mt-6" />
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <WorkoutListItem
              key={workout.id}
              workout={workout}
              onDelete={() => {
                fetch(
                  `${process.env.EXPO_PUBLIC_BACKEND_URL}/workouts/delete/${workout.id}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${SecureStore.getItem(
                        "jwtToken"
                      )}`,
                    },
                  }
                ).then((res) => {
                  if (res.ok) {
                    setWorkouts(workouts.filter((w) => w.id !== workout.id));
                  }
                });
              }}
              onEdit={() => {
                clearContext();
                setWorkoutName(workout.workoutName);
                setExercises(workout.exercises ?? []);
                router.push("/(training)/newWorkout?workoutId=" + workout.id);
              }}
              onStartPress={() => {
                setWorkout(workout);
                router.push("/(training)/workout");
              }}
            />
          ))
        ) : (
          <Text className="text-white text-lg font-[HelveticaNeue] self-center mt-4">
            No workouts found
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
