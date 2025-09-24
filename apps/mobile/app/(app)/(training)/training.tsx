import { View, Text } from 'react-native';
import GenericButton from '../../../components/GenericButton';
import Seperator from '../../../components/Separator';
import WorkoutListItem from '../../../components/WorkoutListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { WorkoutType } from '../../../types/ExerciseTypes';
import { getUserWorkouts } from '../../../services/getUserWorkouts';
import { CreateWorkoutContext } from '../../../context/CreateWorkoutContext';
import { useContext } from 'react';
import * as SecureStore from "expo-secure-store";

export default function Training() {

  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const { clearContext, setWorkoutName, setExercises, workoutName } = useContext(CreateWorkoutContext);

  useEffect(() => {
    getUserWorkouts().then((data) => {
      setWorkouts(data);
    });
  }, [clearContext]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
    <View className='p-2'>
      <GenericButton text='+ New Workout' className='w-52 h-13 mt-2 ml-2 py-3' onPress={() => {
        clearContext();
        router.push('/(training)/newWorkout')}
        } />
      <Seperator className='h-[0.5px] mt-6' />
      {workouts.length > 0 ? workouts.map((workout) => (
        <WorkoutListItem 
          key={workout.id} 
          workout={workout} 
          onDelete={() => {
            fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/workouts/delete/${workout.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${SecureStore.getItem('jwtToken')}`,
              },
            }).then((res) => {
              if (res.ok) {
                setWorkouts(workouts.filter((w) => w.id !== workout.id));
              }
            });
          }}
          onEdit={() => {
            clearContext();
            setWorkoutName(workout.workoutName);
            setExercises(workout.exercises ?? []);
            router.push('/(training)/newWorkout?workoutId=' + workout.id);
          }}
          onStartPress={() => {
            console.log(`Starting workout: ${workout.workoutName}`);
            // Add your workout start logic here
          }} 
        />
      )) : 
        <Text className='text-white text-lg font-[HelveticaNeue] self-center mt-4'>No workouts found</Text>
      }
    </View>
    </SafeAreaView>
  )
}