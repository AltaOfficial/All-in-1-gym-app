import { createContext, useState, ReactNode } from 'react';
import { ExerciseType } from '../types/ExerciseTypes';

interface CreateWorkoutContextType {
  // Workout information
  exercises: ExerciseType[];
  workoutName: string;
  // Methods
  setExercises: (exercises: ExerciseType[]) => void;
  setWorkoutName: (workoutName: string) => void;
  addExercise: (exercise: ExerciseType) => void;
  clearContext: () => void;
}

export const CreateWorkoutContext = createContext<CreateWorkoutContextType>({
    // Workout information
    exercises: [],
    workoutName: '',
    // Methods
    setExercises: () => {},
    setWorkoutName: () => {},
    addExercise: () => {},
    clearContext: () => {},
  });

export const CreateWorkoutProvider = ({ children }: {children: ReactNode}) => {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [workoutName, setWorkoutName] = useState('');

  const addExercise = (exercise: ExerciseType) => {
    setExercises(prev => [...prev, exercise]);
  };

  const clearContext = () => {
    setExercises([]);
    setWorkoutName('');
  };

  const value: CreateWorkoutContextType = {
    exercises,
    workoutName,
    setExercises,
    setWorkoutName,
    addExercise,
    clearContext,
  };

  return (
    <CreateWorkoutContext.Provider value={value}>
      {children}
    </CreateWorkoutContext.Provider>
  );
};
