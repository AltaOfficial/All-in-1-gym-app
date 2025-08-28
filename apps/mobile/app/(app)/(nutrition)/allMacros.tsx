import { ScrollView, Text, View } from 'react-native'
import CalandarNavbar from '../../../components/CalandarNavbar'
import Separator from '../../../components/Separator';
import MacroProgressBar from '../../../components/MacroProgressBar';
import { useContext, useState } from 'react';
import { MetricsContext } from '../../../context/MetricsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NutritionMetrics } from '../../../types/metricsType';
import * as SecureStore from 'expo-secure-store';
import { UserContext } from '../../../context/UserContext';

const AllMacros = () => {
  const { metrics } = useContext(MetricsContext);
  const { user } = useContext(UserContext);
  const [currentMetrics, setCurrentMetrics] = useState<NutritionMetrics | null>(metrics);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-black">
      <CalandarNavbar onDateSelect={async (date) => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/metrics/date`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`
          },
          body: JSON.stringify({
            date: date.toISOString().split('T')[0]
          })
        })
          .then(async res => {
            if (res.ok) {
              if(res.headers.get('Content-Type') === 'application/json') {
                const data = await res.json();
                return setCurrentMetrics(data);
              } else {
                return setCurrentMetrics(null);
              }
            }
            throw new Error('Failed to fetch metrics');
          });
      }} />
      <Separator className="h-[0.4px]"/>
      <ScrollView className="flex-1 flex-col">
        <View className="px-6 flex-row justify-end mt-6 mb-2">
          <Text className="text-white text-right w-20 font-[HelveticaNeue] text-lg">Total</Text>
          <Text className="text-white text-right w-20 font-[HelveticaNeue] text-lg">Goal</Text>
          <Text className="text-white text-right w-20 font-[HelveticaNeue] text-lg">Left</Text>
        </View>
        <View className="flex-col gap-3 pb-10">
          <MacroProgressBar title="Protein" barClassName="bg-protein" current={currentMetrics?.protein || 0} goal={currentMetrics?.goalProtein || user?.goalProtein || 0} unit="g" />
          <MacroProgressBar title="Carbohydrates" barClassName="bg-carbs" current={currentMetrics?.carbohydrates || 0} goal={currentMetrics?.goalCarbohydrates || user?.goalCarbohydrates || 0} unit="g" />
          <MacroProgressBar title="Fat" barClassName="bg-fat" current={currentMetrics?.fat || 0} goal={currentMetrics?.goalFat || user?.goalFat || 0} unit="g" />
          <MacroProgressBar title="Fiber" current={currentMetrics?.fiber || 0} goal={currentMetrics?.goalFiber || user?.goalFiber || 0} unit="g" />
          <MacroProgressBar title="Sugar" current={currentMetrics?.sugar || 0} goal={currentMetrics?.goalSugar || user?.goalSugar || 0} unit="g" />
          <MacroProgressBar title="Saturated Fat" current={currentMetrics?.saturatedFat || 0} goal={currentMetrics?.goalSaturatedFat || user?.goalSaturatedFat || 0} unit="g" />
          <MacroProgressBar title="Polyunsaturated Fat" current={currentMetrics?.polyunsaturatedFat || 0} goal={currentMetrics?.goalPolyunsaturatedFat || user?.goalPolyunsaturatedFat || 0} unit="g" />
          <MacroProgressBar title="Monounsaturated Fat" current={currentMetrics?.monounsaturatedFat || 0} goal={currentMetrics?.goalMonounsaturatedFat || user?.goalMonounsaturatedFat || 0} unit="g" />
          <MacroProgressBar title="Trans Fat" current={currentMetrics?.transFat || 0} goal={currentMetrics?.goalTransFat || user?.goalTransFat || 0} unit="g" />
          <MacroProgressBar title="Cholesterol" current={currentMetrics?.cholesterol || 0} goal={currentMetrics?.goalCholesterol || user?.goalCholesterol || 0} unit="mg" />
          <MacroProgressBar title="Sodium" current={currentMetrics?.sodium || 0} goal={currentMetrics?.goalSodium || user?.goalSodium || 0} unit="mg" />
          <MacroProgressBar title="Potassium" current={currentMetrics?.potassium || 0} goal={currentMetrics?.goalPotassium || user?.goalPotassium || 0} unit="mg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default AllMacros