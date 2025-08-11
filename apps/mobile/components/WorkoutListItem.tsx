import { View, Text } from 'react-native';
import GenericButton from './GenericButton';
import MoreIconVertical from '../assets/icons/MoreIconVertical';

interface WorkoutListItemProps {
  workout: {
    id: number;
    name: string;
  };
  onStartPress: () => void;
}

const WorkoutListItem = ({ workout, onStartPress }: WorkoutListItemProps) => {
  return (
    <View className='flex-row justify-between items-center mb-4 p-3'>
      <Text className='text-white text-lg font-[HelveticaNueue]'>{workout.name}</Text>
      <View className='flex-row items-center gap-2'>
        <GenericButton text='Start' className='w-32 py-1' onPress={onStartPress} />
        <MoreIconVertical width={25} height={25} fill='white' />
      </View>
    </View>
  );
};

export default WorkoutListItem;
