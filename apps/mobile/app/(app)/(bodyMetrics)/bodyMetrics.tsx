import React from 'react'
import { View, Text, ScrollView, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChevronRightIcon from '../../../assets/icons/ChevronRightIcon'
import { router } from 'expo-router'

interface BodyMetric {
  name: string;
  value: string;
}

export default function BodyMetrics() {
  const bodyMetrics: BodyMetric[] = [
    { name: 'Body Fat', value: '39.0%' },
    { name: 'Shoulders', value: '17 in' },
    { name: 'Chest', value: '28 in' },
    { name: 'Waist', value: '37 in' },
    { name: 'Hips', value: '37 in' },
    { name: 'Left Bicep', value: '37 in' },
    { name: 'Right Bicep', value: '37 in' },
    { name: 'Right Calf', value: '37 in' },
    { name: 'Left Calf', value: '37 in' },
    { name: 'Right Thigh', value: '37 in' },
    { name: 'Left Thigh', value: '37 in' },
    { name: 'Neck', value: '14 in' },
  ]

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <Pressable className="px-4 mb-6" onPress={() => router.push('/gallery')}>
          <View className="flex-col bg-gray1 rounded-xl p-4 gap-4">
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">View Gallery</Text>
            <View className="flex-row justify-between items-end">
              <View className="flex-row gap-4">
                <Image source={require('../../../assets/images/gallery image 1.png')} className="w-20 h-20 rounded-xl" />
                <Image source={require('../../../assets/images/gallery image 1.png')} className="w-20 h-20 rounded-xl" />
                <Image source={require('../../../assets/images/gallery image 1.png')} className="w-20 h-20 rounded-xl" />
              </View>
              <ChevronRightIcon height={20} width={20} fill="white" />
            </View>
          </View>
        </Pressable>

        <View className="px-4 pb-6">
          {bodyMetrics.map((metric, index) => (
            <Pressable key={index} className="bg-gray1 rounded-xl p-4 mb-3" onPress={() => router.push('/metricDataDates')}>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white text-lg font-[HelveticaNeue] font-bold">{metric.name}</Text>
                  <Text className="text-gray3 text-sm font-[HelveticaNeue]">{metric.value}</Text>
                </View>
                <ChevronRightIcon height={20} width={20} fill="white" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
