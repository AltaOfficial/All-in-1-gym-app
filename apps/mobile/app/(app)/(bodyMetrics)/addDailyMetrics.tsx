import { useState } from 'react';
import { ScrollView, Text, View, Image, TextInput } from 'react-native';
import CameraIcon from '../../../assets/icons/CameraIcon';
import Separator from '../../../components/Separator';
import { SafeAreaView } from 'react-native-safe-area-context';
import GenericButton from '../../../components/GenericButton';

const AddDailyMetrics = () => {

  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [sidePhoto, setSidePhoto] = useState<string | null>(null);

  return (
    <SafeAreaView edges={['bottom']} className='flex-1'>
      <ScrollView>
        <View className='flex-row gap-8 justify-center items-center'>
          <View className='flex-col gap-2 mt-4 justify-center items-center'>
            {frontPhoto ? <Image className='flex-row h-16 w-16 gap-2 border-white border-2 rounded-lg border-dashed' source={{ uri: frontPhoto }} />
              
             : <View className='flex-row h-48 w-48 gap-2 border-white border-2 rounded-lg border-dashed items-center justify-center'>
              <CameraIcon height={40} width={40} fill="white" />
            </View>}
            <Text className='text-white text-lg font-[HelveticaNeue]'>Front Photo</Text>
          </View>

          <View className='flex-col gap-2 mt-4 justify-center items-center'>
            {frontPhoto ? <Image className='flex-row h-16 w-16 gap-2 border-white border-2 rounded-lg border-dashed' source={{ uri: frontPhoto }} />
             : <View className='flex-row h-48 w-48 gap-2 border-white border-2 rounded-lg border-dashed items-center justify-center'>
              <CameraIcon height={40} width={40} fill="white" />
            </View>}
            <Text className='text-white text-lg font-[HelveticaNeue]'>Side Photo</Text>
          </View>
        </View>
        <Separator className="h-[0.4px] mt-10 mb-5"/>
        <View className='px-4'>
          <Text className='text-white text-2xl font-[HelveticaNeue] font-bold'>Upper Body</Text>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Neck</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' keyboardType="numeric" />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Shoulders</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' keyboardType="numeric" />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Waist</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' keyboardType="numeric" />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
        </View>

        <View className='px-4 mt-10'>
          <Text className='text-white text-2xl font-[HelveticaNeue] font-bold'>Arms</Text>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Left Bicep</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' keyboardType="numeric" />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Right Bicep</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' keyboardType="numeric" />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Waist</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' keyboardType="numeric" />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <GenericButton text="Complete" onPress={async () => {}} className="self-center absolute bottom-20" textClassName="text-lg" />
    </SafeAreaView>
  )
}
export default AddDailyMetrics