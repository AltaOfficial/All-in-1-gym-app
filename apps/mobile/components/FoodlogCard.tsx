import React from 'react'
import { View, Text, Pressable } from 'react-native'
import FastFoodIcon from '../assets/icons/FastFoodIcon'
import ChevronRightIcon from '../assets/icons/ChevronRightIcon'
import { router } from 'expo-router'

export default function FoodlogCard() {
  return (
    <Pressable onPress={() => router.push('/bodyMetrics')}>
        <View className={`bg-gray1 h-22 rounded-xl p-4 mx-2 flex-row items-center justify-between`}>
            <View className='flex-row items-center gap-4'>
                <FastFoodIcon height={45} width={45} fill='#F43A45' />
                <Text className='text-white text-lg'>Food Log</Text>
            </View>
            <ChevronRightIcon height={20} width={20} fill='white' />
        </View>
    </Pressable>
  )
}
