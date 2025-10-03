import { View } from "react-native";
import React, { useContext, useState } from "react";
import GenericButton from "../../../components/GenericButton";
import WorkoutHistoryTable from "../../../components/WorkoutHistoryTable";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateWorkoutContext } from "../../../context/CreateWorkoutContext";

const WorkoutHistory = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<number>(0);
  const { workouts } = useContext(CreateWorkoutContext);

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
