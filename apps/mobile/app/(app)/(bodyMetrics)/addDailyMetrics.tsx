import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, TextInput } from 'react-native';
import CameraIcon from '../../../assets/icons/CameraIcon';
import Separator from '../../../components/Separator';
import { SafeAreaView } from 'react-native-safe-area-context';
import GenericButton from '../../../components/GenericButton';
import * as SecureStore from "expo-secure-store";
import { router } from 'expo-router';
import { getCurrentUser } from '../../../services/getCurrentUser';
import { getBodyMetrics } from '../../../services/getBodyMetrics';

const AddDailyMetrics = () => {

  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [sidePhoto, setSidePhoto] = useState<string | null>(null);
  
  // Form state for body metrics
  const [bodyFat, setBodyFat] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [shoulders, setShoulders] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [chest, setChest] = useState<string>('');
  const [hips, setHips] = useState<string>('');
  const [leftBicep, setLeftBicep] = useState<string>('');
  const [rightBicep, setRightBicep] = useState<string>('');
  const [leftThigh, setLeftThigh] = useState<string>('');
  const [rightThigh, setRightThigh] = useState<string>('');
  const [leftCalf, setLeftCalf] = useState<string>('');
  const [rightCalf, setRightCalf] = useState<string>('');
  const [isLbs, setIsLbs] = useState(true);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setIsLbs(user?.weightType === "LBS");
    });
    getBodyMetrics().then((bodyMetrics) => {
      setFrontPhoto(bodyMetrics?.frontPhotoUrl || null);
      setSidePhoto(bodyMetrics?.sidePhotoUrl || null);
      setBodyFat(bodyMetrics?.bodyFat?.toString() || '');
      setWeight(bodyMetrics?.weight?.toString() || '');
      setShoulders(bodyMetrics?.shouldersCircumference?.toString() || '');
      setNeck(bodyMetrics?.neckCircumference?.toString() || '');
      setWaist(bodyMetrics?.waistCircumference?.toString() || '');
      setChest(bodyMetrics?.chestCircumference?.toString() || '');
      setHips(bodyMetrics?.hipCircumference?.toString() || '');
      setLeftBicep(bodyMetrics?.leftBicepCircumference?.toString() || '');
      setRightBicep(bodyMetrics?.rightBicepCircumference?.toString() || '');
      setLeftThigh(bodyMetrics?.leftThighCircumference?.toString() || '');
      setRightThigh(bodyMetrics?.rightThighCircumference?.toString() || '');
      setLeftCalf(bodyMetrics?.leftCalfCircumference?.toString() || '');
      setRightCalf(bodyMetrics?.rightCalfCircumference?.toString() || '');
    });
  }, []);

  const handleComplete = async () => {
    try {

      // Prepare the request payload
      const requestData = {
        frontPhotoUrl: frontPhoto,
        sidePhotoUrl: sidePhoto,
        weight: weight ? parseFloat(weight) : null,
        bodyFat: bodyFat ? parseFloat(bodyFat) : null,
        shouldersCircumference: shoulders ? parseFloat(shoulders) : null,
        neckCircumference: neck ? parseFloat(neck) : null,
        waistCircumference: waist ? parseFloat(waist) : null,
        chestCircumference: chest ? parseFloat(chest) : null,
        hipCircumference: hips ? parseFloat(hips) : null,
        leftBicepCircumference: leftBicep ? parseFloat(leftBicep) : null,
        rightBicepCircumference: rightBicep ? parseFloat(rightBicep) : null,
        rightCalfCircumference: rightCalf ? parseFloat(rightCalf) : null,
        leftCalfCircumference: leftCalf ? parseFloat(leftCalf) : null,
        leftThighCircumference: leftThigh ? parseFloat(leftThigh) : null,
        rightThighCircumference: rightThigh ? parseFloat(rightThigh) : null,
      };

      // Check if at least one metric is provided
      const hasMetrics = Object.values(requestData).some(value => value !== null);
      if (!hasMetrics) {
        return;
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/bodymetrics/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
          // Navigate back to previous screen
          router.back();
      } else {
        const errorData = await response.json();
        console.error('Error logging body metrics:', errorData.message || 'Failed to log body metrics');
      }
    } catch (error) {
      console.error('Error logging body metrics:', error);
      console.error('Network error. Please try again.');
    }
  };

  const resetForm = () => {
    setFrontPhoto(null);
    setSidePhoto(null);
    setBodyFat('');
    setWeight('');
    setShoulders('');
    setNeck('');
    setWaist('');
    setChest('');
    setHips('');
    setLeftBicep('');
    setRightBicep('');
    setLeftThigh('');
    setRightThigh('');
    setLeftCalf('');
    setRightCalf('');
  };

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
            {sidePhoto ? <Image className='flex-row h-16 w-16 gap-2 border-white border-2 rounded-lg border-dashed' source={{ uri: sidePhoto }} />
             : <View className='flex-row h-48 w-48 gap-2 border-white border-2 rounded-lg border-dashed items-center justify-center'>
              <CameraIcon height={40} width={40} fill="white" />
            </View>}
            <Text className='text-white text-lg font-[HelveticaNeue]'>Side Photo</Text>
          </View>
        </View>
        <Separator className="h-[0.4px] mt-10 mb-5"/>
        
        <View className='px-4'>
          <Text className='text-white text-2xl font-[HelveticaNeue] font-bold'>Body Composition</Text>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Body Fat</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={bodyFat}
                onChangeText={setBodyFat}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>%</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Weight</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={weight}
                onChangeText={setWeight}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>{isLbs ? "lbs" : "kg"}</Text>
            </View>
          </View>
        </View>

        <View className='px-4 mt-10'>
          <Text className='text-white text-2xl font-[HelveticaNeue] font-bold'>Upper Body</Text>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Neck</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={neck}
                onChangeText={setNeck}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Shoulders</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={shoulders}
                onChangeText={setShoulders}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Chest</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={chest}
                onChangeText={setChest}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Waist</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={waist}
                onChangeText={setWaist}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Hips</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={hips}
                onChangeText={setHips}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
        </View>

        <View className='px-4 mt-10'>
          <Text className='text-white text-2xl font-[HelveticaNeue] font-bold'>Arms</Text>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Left Bicep</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={leftBicep}
                onChangeText={setLeftBicep}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Right Bicep</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={rightBicep}
                onChangeText={setRightBicep}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
        </View>

        <View className='px-4 mt-10'>
          <Text className='text-white text-2xl font-[HelveticaNeue] font-bold'>Legs</Text>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Left Thigh</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={leftThigh}
                onChangeText={setLeftThigh}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Right Thigh</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={rightThigh}
                onChangeText={setRightThigh}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Left Calf</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={leftCalf}
                onChangeText={setLeftCalf}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
          <View className='flex-col gap-2 mt-4'>
            <Text className='text-white text-lg font-[HelveticaNeue]'>Right Calf</Text>
            <View className='flex-row items-center gap-2'>
              <TextInput 
                className='text-white text-lg h-16 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3' 
                keyboardType="numeric" 
                value={rightCalf}
                onChangeText={setRightCalf}
                placeholder="0.0"
                placeholderTextColor="#666"
              />
              <Text className='text-white text-lg font-[HelveticaNeue]'>in</Text>
            </View>
          </View>
        </View>
        <View className="h-32" />
      </ScrollView>
      <GenericButton text="Complete" onPress={handleComplete} className="self-center absolute bottom-20" textClassName="text-lg" />
    </SafeAreaView>
  )
}
export default AddDailyMetrics