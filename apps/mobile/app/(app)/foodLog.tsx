import { ScrollView, Text, View } from 'react-native'
import CalandarNavbar from '../../components/CalandarNavbar'
import Separator from '../../components/Separator';
import MacroProgressBar from '../../components/MacroProgressBar';
import { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { FoodLogItemType } from '../../types/foodLogItemType';

const FoodLog = () => {

  const [date, setDate] = useState(new Date());
  const [foodLog, setFoodLog] = useState<FoodLogItemType[]>([]);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/foods/foodlog/date`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SecureStore.getItem('jwtToken')}`
        },
        body: JSON.stringify({
            date: date.toISOString().split('T')[0]
        })
    })
    .then(async res => {
        if (res.ok) {
            if(res.headers.get('Content-Type') === 'application/json') {
                const data = await res.json();
                return setFoodLog(data);
            } else {
                return setFoodLog([]);
            }
        }
    })
  }, [date])

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-black">
      <CalandarNavbar onDateSelect={(date) => setDate(date)} />
      <Separator className="h-[0.4px]"/>
      <ScrollView className="flex-1 flex-col">
          <View className='flex-row justify-between items-center px-4 my-3'>
            <View>
                <Text className='text-white text-xl font-[HelveticaNeue] font-bold'>Breakfast</Text>
                <Text className='text-white text-lg font-[HelveticaNeue]'>1,076 cal</Text> 
            </View>
            <Text className='text-primary text-lg font-[HelveticaNeue]'>Add Food</Text>
          </View>
        <Separator className="h-[0.4px]"/>
        <View>
            <View className='flex-row justify-between items-center px-4 my-3'>
                <View>
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Instant oats, cooked</Text>
                    <Text className='text-gray3 font-[HelveticaNeue]'>0.5 cup</Text> 
                </View>
                <View className='flex-col items-end gap-2'>
                    <Text className='text-white text-lg font-[HelveticaNeue] font-bold'>184 cal</Text>
                    <Text className='text-gray3 font-[HelveticaNeue]'>7:40 AM</Text>
                </View>
            </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  )
}
export default FoodLog