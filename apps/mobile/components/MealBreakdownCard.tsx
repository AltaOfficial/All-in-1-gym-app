import { View, Text, Pressable, Image } from 'react-native'
import { router } from 'expo-router'
import Checkbox from './Checkbox'

export default function MealBreakdownCard({imgUrl, protein, carbs, fat, name, calories, subLabel}: {imgUrl?: string, protein: number, carbs: number, fat: number, name: string, calories: number, subLabel: string}) {
  return (
    <Pressable onPress={() => router.push('/bodyMetrics')}>
        <View className={`bg-gray1 rounded-2xl p-4 flex-row justify-between`}>
            <View className='flex-row'>
                {imgUrl && <Image source={{ uri: imgUrl }} className='w-[27%] rounded-xl h-full object-cover mr-4' />}
                <View className='flex-col gap-4'>
                    <View className='flex-col items-start gap-2'>
                        <Text className='text-white text-lg'>
                            {(`${name}`.length > 22 && imgUrl) ? `${`${name}`.slice(0, 22).trim()}...` : `${name}`}
                        </Text>
                        <Text className='text-white/50 text-sm'>
                        {(`${calories} cal, ${subLabel}`.length > 30 && imgUrl) ? `${`${calories} cal, ${subLabel}`.slice(0, 30).trim()}...` : `${calories} cal, ${subLabel}`}
                        </Text>
                        <View className='flex-row items-center gap-2'>
                            <Text className='text-protein text-xs bg-gray2 p-2 px-3 rounded-full'>P: {protein}g</Text>
                            <Text className='text-carbs text-xs bg-gray2 p-2 px-3 rounded-full'>C: {carbs}g</Text>
                            <Text className='text-fat text-xs bg-gray2 p-2 px-3 rounded-full'>F: {fat}g</Text>
                        </View>
                    </View>
                </View>
            </View>
            <Checkbox checked={false} onPress={() => {}} />
        </View>
    </Pressable>
  )
}