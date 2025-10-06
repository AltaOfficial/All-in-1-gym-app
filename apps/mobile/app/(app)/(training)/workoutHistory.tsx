import { View, ScrollView } from "react-native";
import React, { useContext, useState, useRef } from "react";
import GenericButton from "../../../components/GenericButton";
import WorkoutHistoryTable from "../../../components/WorkoutHistoryTable";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateWorkoutContext } from "../../../context/CreateWorkoutContext";

const WorkoutHistory = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<number>(0);
  const { workouts } = useContext(CreateWorkoutContext);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleWorkoutChange = (index: number) => {
    setSelectedWorkout(index);
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      <WorkoutHistoryTable
        workout={workouts[selectedWorkout]}
        scrollViewRef={scrollViewRef as React.RefObject<ScrollView>}
      />
      <View className="flex-row gap-2 mt-auto">
        <ScrollView
          className="flex gap-2"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {workouts.map((workout, index) => (
            <GenericButton
              className={`${selectedWorkout === index ? "" : "!bg-gray1"}`}
              key={workout.id}
              text={workout.workoutName}
              onPress={() => handleWorkoutChange(index)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default WorkoutHistory;
