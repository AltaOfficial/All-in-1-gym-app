import { View, Text, Pressable } from 'react-native'
import CalendarIcon from '../assets/icons/CalendarIcon'
import GenericButton from './GenericButton'
import MealBreakdownCard from './MealBreakdownCard'

export default function TodaysMealBreakdown() {
    return (
    <View className='px-4 pb-12 pt-2'>
        <View className='flex-row justify-between items-center mb-5'>
            <Text className='text-white font-[HelveticaNeue] text-2xl'>Todays Meal Breakdown</Text>
            <CalendarIcon height={28} width={28} fill='white' />
        </View>
        <View className='flex-row text-pretty gap-3 items-center'>
            <GenericButton className='py-2 px-1 flex-1' onPress={() => {}} text='Breakfast' />
            <GenericButton className='py-2 px-1 flex-1 !bg-[#27272A]' onPress={() => {}} text='Lunch' textClassName='!text-white/70' />
            <GenericButton className='py-2 px-1 flex-1 !bg-[#27272A]' onPress={() => {}} text='Dinner' textClassName='!text-white/70' />
            <GenericButton className='py-2 px-1 flex-1 !bg-[#27272A]' onPress={() => {}} text='Snacks' textClassName='!text-white/70' />
        </View>

        <View className='mt-4 gap-3'>
            <MealBreakdownCard protein={17} carbs={22} fat={19} name='2% Milk' calories={320} subLabel='Great Value, 9.1 fluid ounce' />
            <MealBreakdownCard protein={17} carbs={22} fat={19} imgUrl='https://www.allrecipes.com/thmb/0VXMwCY9RVNrNvWcF_9v0iZpNqA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/JF_241160_CreamyCottageCheeseScrambled_4x3_12902-619d00dc88594ea9b8ed884a108db16d.jpg' name='Creamy Cottage Cheese Scrambled Eggs' calories={320} subLabel='Great Value, 9.1 fluid ounce' />
        </View>

        <View className='flex-row items-center justify-center mt-4 border-gray2 border rounded-xl py-3'>
            <Text className='text-white font-[HelveticaNeue] text-base'>+ Add Item</Text>
        </View>

    </View>
  )
}