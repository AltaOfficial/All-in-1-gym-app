import { createContext, useState, ReactNode, useEffect } from "react";
import {
  ExerciseSetType,
  ExerciseType,
  WorkoutType,
} from "../types/ExerciseTypes";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { EffortEnum } from "../types/effortEnum";

interface WorkoutContextType {
  // Workout information
  workout: WorkoutType | null;
  workoutLogId: string;
  currentExerciseIndex: number;
  currentExerciseData: ExerciseSetType[];

  // Methods
  setWorkout: (workout: WorkoutType) => void;
  nextExercise: (sets: ExerciseSetType[]) => Promise<ExerciseType | undefined>;
  setWorkoutLogId: (workoutLogId: string) => void;
  endWorkout: (sets?: ExerciseSetType[]) => Promise<void>;
  setCurrentExerciseData: (
    data: ExerciseSetType[] | ((prev: ExerciseSetType[]) => ExerciseSetType[])
  ) => void;
}

export const WorkoutContext = createContext<WorkoutContextType>({
  workout: null,
  workoutLogId: "",
  currentExerciseIndex: 0,
  currentExerciseData: [],
  // Methods
  setWorkout: () => {},
  nextExercise: async () => undefined,
  setWorkoutLogId: () => {},
  endWorkout: async () => {},
  setCurrentExerciseData: () => {},
});

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [workoutLogId, setWorkoutLogId] = useState("");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExerciseData, setCurrentExerciseData] = useState<
    ExerciseSetType[]
  >([]);

  const nextExercise = async (sets: ExerciseSetType[]) => {
    let currentWorkoutLogId = workoutLogId;
    console.log(sets);

    // Create workout log if it doesn't exist
    if (!workoutLogId) {
      try {
        const token = await SecureStore.getItemAsync("jwtToken");
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/workout-log/start${
            workout?.id ? `?workoutId=${workout.id}` : ""
          }`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const newWorkoutLogId = await response.text();
          setWorkoutLogId(newWorkoutLogId);
          currentWorkoutLogId = newWorkoutLogId;
        }
      } catch (error) {
        console.error("Error creating workout log:", error);
        return;
      }
    }

    // Send the exercise metrics to the backend
    const currentExercise = workout?.exercises?.[currentExerciseIndex];

    if (currentExercise?.id && currentWorkoutLogId) {
      try {
        const token = await SecureStore.getItemAsync("jwtToken");
        await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/exercise/save-set`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              exerciseLogId: null,
              workoutLogId: currentWorkoutLogId,
              exerciseParentId: currentExercise.id,
              setsList: sets,
            }),
          }
        );
      } catch (error) {
        console.error("Error saving exercise set:", error);
      }
    }

    setCurrentExerciseIndex(currentExerciseIndex + 1);

    const nextExercise = workout?.exercises?.[currentExerciseIndex + 1];

    // Reset currentExerciseData for the next exercise
    if (nextExercise) {
      setCurrentExerciseData(
        Array.from({ length: nextExercise.goalSets ?? 0 }, () => ({
          repsDone: 0,
          effortType: EffortEnum.EASY,
          note: "",
          weight: nextExercise.weight ?? 0,
          restTimeInSeconds: nextExercise.restTimeInSeconds ?? 0,
        }))
      );
    }

    return nextExercise as ExerciseType | undefined;
  };

  const endWorkout = async (sets?: ExerciseSetType[]) => {
    // If sets are provided, save them before ending the workout
    if (sets && sets.length > 0) {
      let currentWorkoutLogId = workoutLogId;

      // Create workout log if it doesn't exist
      if (!currentWorkoutLogId) {
        try {
          const token = await SecureStore.getItemAsync("jwtToken");
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/workout-log/start${
              workout?.id ? `?workoutId=${workout.id}` : ""
            }`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            currentWorkoutLogId = await response.text();
            setWorkoutLogId(currentWorkoutLogId);
          }
        } catch (error) {
          console.error("Error creating workout log:", error);
        }
      }

      const currentExercise = workout?.exercises?.[currentExerciseIndex];
      if (currentExercise?.id && currentWorkoutLogId) {
        try {
          const token = await SecureStore.getItemAsync("jwtToken");
          await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/exercise/save-set`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                exerciseLogId: null,
                workoutLogId: currentWorkoutLogId,
                exerciseParentId: currentExercise.id,
                setsList: sets,
              }),
            }
          );
        } catch (error) {
          console.error("Error saving final exercise set:", error);
        }
      }
    }

    setWorkout(null);
    setWorkoutLogId("");
    setCurrentExerciseIndex(0);
    setCurrentExerciseData([]);
    router.navigate("/training");
  };

  // Initialize currentExerciseData when workout is set
  useEffect(() => {
    if (workout?.exercises?.[currentExerciseIndex]) {
      const currentExercise = workout.exercises[currentExerciseIndex];
      setCurrentExerciseData(
        Array.from({ length: currentExercise.goalSets ?? 0 }, () => ({
          repsDone: 0,
          effortType: EffortEnum.EASY,
          note: "",
          weight: currentExercise.weight ?? 0,
          restTimeInSeconds: currentExercise.restTimeInSeconds ?? 0,
        }))
      );
    }
  }, [workout]);

  const value: WorkoutContextType = {
    workout,
    workoutLogId,
    currentExerciseIndex,
    currentExerciseData,
    setWorkout,
    nextExercise,
    setWorkoutLogId,
    endWorkout,
    setCurrentExerciseData,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};
