import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { ExerciseType, WorkoutType } from "../types/ExerciseTypes";
import { getUserWorkouts } from "../services/getUserWorkouts";

interface CreateWorkoutContextType {
  // Workout information
  exercises: ExerciseType[];
  workoutName: string;
  workouts: WorkoutType[];
  // Methods
  setExercises: (exercises: ExerciseType[]) => void;
  setWorkoutName: (workoutName: string) => void;
  setWorkouts: (workouts: WorkoutType[]) => void;
  addExercise: (exercise: ExerciseType) => void;
  clearContext: () => void;
  refreshWorkouts: () => void;
}

export const CreateWorkoutContext = createContext<CreateWorkoutContextType>({
  // Workout information
  exercises: [],
  workoutName: "",
  workouts: [],
  // Methods
  setExercises: () => {},
  setWorkoutName: () => {},
  setWorkouts: () => {},
  addExercise: () => {},
  clearContext: () => {},
  refreshWorkouts: () => {},
});

export const CreateWorkoutProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);

  const addExercise = (exercise: ExerciseType) => {
    setExercises((prev) => [...prev, exercise]);
  };

  const clearContext = useCallback(() => {
    console.log("cleared");
    setExercises([]);
    setWorkoutName("");
  }, []);

  const refreshWorkouts = useCallback(async () => {
    const data = await getUserWorkouts();
    setWorkouts(data);
  }, []);

  // Fetch workouts on initial mount if not already loaded
  useEffect(() => {
    if (workouts.length === 0) {
      refreshWorkouts();
    }
  }, []);

  const value: CreateWorkoutContextType = {
    exercises,
    workoutName,
    workouts,
    setExercises,
    setWorkoutName,
    setWorkouts,
    addExercise,
    clearContext,
    refreshWorkouts,
  };

  return (
    <CreateWorkoutContext.Provider value={value}>
      {children}
    </CreateWorkoutContext.Provider>
  );
};
