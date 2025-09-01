import { View } from 'react-native';
import GenericButton from '../../../components/GenericButton';
import Seperator from '../../../components/Separator';
import WorkoutListItem from '../../../components/WorkoutListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Training() {

  const workouts = [
    {
      id: 1,
      name: "Mondays workout",
    },
    {
      id: 2,
      name: "Full Body B",
    },
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
    <View className='p-2'>
      <GenericButton text='+ New Workout' className='w-52 h-13 mt-2 ml-2 py-3' onPress={() => {router.push('/(training)/newWorkout')}} />
      <Seperator className='h-[0.5px] mt-6' />
      {workouts.map((workout) => (
        <WorkoutListItem 
          key={workout.id} 
          workout={workout} 
          onStartPress={() => {
            console.log(`Starting workout: ${workout.name}`);
            // Add your workout start logic here
          }} 
        />
      ))}
    </View>
    </SafeAreaView>
  )
}