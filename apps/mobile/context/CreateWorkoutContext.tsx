import { createContext, useState, ReactNode } from 'react';
import { ExerciseType } from '../types/ExerciseTypes';

interface CreateWorkoutContextType {
  // Workout information
  exercises: ExerciseType[];
  
  // Methods
  setExercises: (exercises: ExerciseType[]) => void;
  clearContext: () => void;
}

export const CreateWorkoutContext = createContext<CreateWorkoutContextType>({
    // Workout information
    exercises: [],
    
    // Methods
    setExercises: () => {},
    clearContext: () => {},
  });

export const CreateWorkoutProvider = ({ children }: {children: ReactNode}) => {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);


  const clearContext = () => {
    setExercises([]);
  };

  const value: CreateWorkoutContextType = {
    exercises,
    setExercises,
    clearContext,
  };

  return (
    <CreateWorkoutContext.Provider value={value}>
      {children}
    </CreateWorkoutContext.Provider>
  );
};
