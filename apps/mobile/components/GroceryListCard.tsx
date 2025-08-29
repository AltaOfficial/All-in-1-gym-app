import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import Checkbox from './Checkbox'

export default function GroceryListCard() {
  return (
    <View className='mb-4'>
        <View className='flex-row justify-between items-center mb-5'>
            <Text className='text-white font-[HelveticaNeue] text-2xl'>This Weeks Grocery List</Text>
        </View>

        <View className={`bg-gray1 h-64 rounded-xl p-4 mx-2 pt-5 flex-col items-center justify-between`}>
            <View className='flex-row items-start gap-4 justify-between w-full'>
                <View className=' flex-col gap-2'>
                    <View className='flex-row items-center'>
                        <Checkbox checked={true} onPress={() => {}} />
                        <Text className='text-white font-[HelveticaNeue]'>Texas Pete Hot Sauce</Text>
                    </View>
                    <View className='flex-row items-center'>
                        <Checkbox checked={false} onPress={() => {}} />
                        <Text className='text-white font-[HelveticaNeue]'>Eggs</Text>
                    </View>
                    <View className='flex-row items-center'>
                        <Checkbox checked={false} onPress={() => {}} />
                        <Text className='text-white font-[HelveticaNeue]'>Chicken Breast</Text>
                    </View>
                </View>
                <View className='flex-col items-center place-self-end place-items-end justify-end align-top'>
                    <Text className='text-white font-[HelveticaNeue]'>Est. Cost:</Text>
                    <Text className='text-white font-[HelveticaNeue]'>$100</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => router.push('/groceryList')} className='flex-row items-center justify-center mt-4 border-gray2 border rounded-xl py-3 w-full'>
                <Text className='text-white font-[HelveticaNeue]'>View Grocery List</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}
