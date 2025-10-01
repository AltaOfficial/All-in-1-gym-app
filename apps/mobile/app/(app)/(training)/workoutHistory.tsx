import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { WorkoutType } from "../../../types/ExerciseTypes";
import { getUserWorkouts } from "../../../services/getUserWorkouts";
import GenericButton from "../../../components/GenericButton";
import WorkoutHistoryTable from "../../../components/WorkoutHistoryTable";
import { SafeAreaView } from "react-native-safe-area-context";

const WorkoutHistory = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<number>(0);
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);

  useEffect(() => {
    getUserWorkouts().then((data) => {
      setWorkouts(data);
    });
  }, []);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      <WorkoutHistoryTable />
      <View className="flex-row flex-wrap gap-2 mt-auto">
        {workouts.map((workout, index) => (
          <GenericButton
            className={`${selectedWorkout === index ? "" : "!bg-gray1"}`}
            key={workout.id}
            text={workout.workoutName}
            onPress={() => setSelectedWorkout(index)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default WorkoutHistory;
