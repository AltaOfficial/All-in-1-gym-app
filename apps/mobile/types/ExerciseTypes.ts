import { EffortEnum } from "./effortEnum";

// Exercise Set Type
export interface ExerciseSetType {
  repsDone?: number | null;
  effortType?: EffortEnum | null;
  note?: string | null;
  weight?: number | null;
  restTimeInSeconds?: number | null;
}

// Exercise Log Types
export interface ExerciseLogType {
  id?: string;
  exerciseParentId: string;
  date: string;
  setsList: ExerciseSetType[];
  weight?: number | null;
  time?: number | null;
}

// Exercise Types
export interface ExerciseType {
  id?: string;
  exerciseName: string;
  exerciseImageUrl?: string | null;
  workoutConnectedToId?: string | null;
  restTimeInSeconds: number;
  goalSets?: number | null;
  goalReps?: number | null;
  isWeightBased?: boolean | null;
  weight?: number | null;
  time?: number | null;
  tutorialUrl?: string | null;
  exerciseLogs?: ExerciseLogType[];
}

// Workout Types
export interface WorkoutType {
  id: string;
  workoutName: string;
  exercises?: ExerciseType[];
}

export interface WorkoutLogType {
  id?: string;
  date: string;
  exerciseLogs: ExerciseLogType[];
  workoutId: string | null;
}
