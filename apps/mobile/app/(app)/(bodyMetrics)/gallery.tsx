import React, { useState } from 'react'
import { Text, View, ScrollView, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChevronLeftIcon from '../../../assets/icons/ChevronLeftIcon'
import ChevronRightIcon from '../../../assets/icons/ChevronRightIcon'
import ChevronUpIcon from '../../../assets/icons/ChevronUpIcon'

const Gallery = () => {
  const [selectedView, setSelectedView] = useState<'front' | 'side'>('front')

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-black">
        <View className='flex-row justify-between items-center bg-gray2 rounded-full w-fit mx-auto'>
          <Pressable onPress={() => setSelectedView('front')}>
            <Text className={`text-white text-lg w-24 text-center font-[HelveticaNeue] ${selectedView === 'front' ? 'bg-primary' : 'bg-gray2'} rounded-full py-4 px-5`}>Front</Text>
          </Pressable>
          <Pressable onPress={() => setSelectedView('side')}>
            <Text className={`text-white text-lg w-24 text-center font-[HelveticaNeue] ${selectedView === 'side' ? 'bg-primary' : 'bg-gray2'} rounded-full py-4 px-5`}>Side</Text>
          </Pressable>
        </View>

        <View className='flex-row gap-4 justify-center items-center mt-10 w-96 h-96 mx-auto'>
          {selectedView === 'front' ? <Image source={require('../../../assets/images/gallery image 2.png')} className='w-full h-full border-4 border-white rounded-3xl' /> : <Image source={require('../../../assets/images/gallery image 1.png')} className='w-full h-full border-4 border-white rounded-3xl' />}
        </View>

        <View className='flex-row gap-4 justify-between items-center px-10 mt-10'>
          <View>
            <View className='flex-row items-center'>
              <Text className='text-white text-lg font-[HelveticaNeue]'>Weight: </Text>
              <Text className='text-white text-lg font-[HelveticaNeue] font-bold'>165 lbs</Text>
            </View>
            <View className='flex-row justify-between items-center'>
              <Text className='text-white text-lg font-[HelveticaNeue]'>Right Bicep: </Text>
              <Text className='text-white text-lg font-[HelveticaNeue] font-bold'>17 in</Text>
            </View>
            <View className='flex-row justify-between items-center'>
              <Text className='text-white text-lg font-[HelveticaNeue]'>Left Bicep: </Text>
              <Text className='text-white text-lg font-[HelveticaNeue] font-bold'>17 in</Text>
            </View>
          </View>

          <View>
            <View className='flex-row justify-between items-center'>
              <Text className='text-white text-lg font-[HelveticaNeue]'>Right Calf: </Text>
              <Text className='text-white text-lg font-[HelveticaNeue] font-bold'>17 in</Text>
            </View>
            <View className='flex-row justify-between items-center'>
              <Text className='text-white text-lg font-[HelveticaNeue]'>Left Calf: </Text>
              <Text className='text-white text-lg font-[HelveticaNeue] font-bold'>17 in</Text>
            </View>
            <View className='flex-row justify-between items-center'>
              <Text className='text-white text-lg font-[HelveticaNeue]'>Right Ankle: </Text>
              <Text className='text-white text-lg font-[HelveticaNeue] font-bold'>17 in</Text>
            </View>
          </View>

        </View>
        <View className='flex-col gap-2 items-center w-full mt-auto mb-10'>
          <ChevronUpIcon height={20} width={20} fill="white" />
          <View className='flex-row justify-center px-10 gap-12'>
            <View className='flex-row bg-white w-10 h-10 rounded-full justify-center items-center'>
              <ChevronLeftIcon height={20} width={20} fill="black" />
            </View>
            <View className='flex-col items-center justify-center'>
              <Text className='text-white text-lg font-[HelveticaNeue]'>May 10, 2025</Text>
            </View>
            <View className='flex-row bg-white w-10 h-10 rounded-full justify-center items-center'>
              <ChevronRightIcon height={20} width={20} fill="black" />
            </View>
          </View>
        </View>
    </SafeAreaView>
  )
}

export default Gallery;