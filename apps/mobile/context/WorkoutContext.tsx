import { createContext, useState, ReactNode } from "react";
import {
  ExerciseSetType,
  ExerciseType,
  WorkoutType,
} from "../types/ExerciseTypes";
import { router } from "expo-router";

interface WorkoutContextType {
  // Workout information
  workout: WorkoutType | null;
  exerciseLogId: string;
  currentExerciseIndex: number;

  // Methods
  setWorkout: (workout: WorkoutType) => void;
  nextExercise: (sets: ExerciseSetType[]) => ExerciseType | undefined;
  setExerciseLogId: (exerciseLogId: string) => void;
  endWorkout: () => void;
}

export const WorkoutContext = createContext<WorkoutContextType>({
  workout: null,
  exerciseLogId: "",
  currentExerciseIndex: 0,
  // Methods
  setWorkout: () => {},
  nextExercise: () => undefined,
  setExerciseLogId: () => {},
  endWorkout: () => {},
});

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [exerciseLogId, setExerciseLogId] = useState("");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const nextExercise = (sets: ExerciseSetType[]) => {
    // send the exercise metrics we get to the backend

    setCurrentExerciseIndex(currentExerciseIndex + 1);
    return workout?.exercises?.[currentExerciseIndex + 1] as
      | ExerciseType
      | undefined;
  };

  const endWorkout = () => {
    setWorkout(null);
    setExerciseLogId("");
    setCurrentExerciseIndex(0);
    router.navigate("/training");
  };

  const value: WorkoutContextType = {
    workout,
    exerciseLogId,
    currentExerciseIndex,
    setWorkout,
    nextExercise,
    setExerciseLogId,
    endWorkout,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};
