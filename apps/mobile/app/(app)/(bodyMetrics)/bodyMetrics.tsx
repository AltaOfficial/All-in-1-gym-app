import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChevronRightIcon from '../../../assets/icons/ChevronRightIcon'
import { router } from 'expo-router'
import { getBodyMetrics } from '../../../services/getBodyMetrics'

interface BodyMetric {
  name: string;
  value: string;
}

export default function BodyMetrics() {
  const [bodyFat, setBodyFat] = useState<string>('');
  const [shoulders, setShoulders] = useState<string>('');
  const [chest, setChest] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hips, setHips] = useState<string>('');
  const [leftBicep, setLeftBicep] = useState<string>('');
  const [rightBicep, setRightBicep] = useState<string>('');
  const [leftThigh, setLeftThigh] = useState<string>('');
  const [rightThigh, setRightThigh] = useState<string>('');
  const [leftCalf, setLeftCalf] = useState<string>('');
  const [rightCalf, setRightCalf] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  
  const bodyMetrics: BodyMetric[] = [
    { name: 'Body Fat', value: bodyFat },
    { name: 'Shoulders', value: shoulders },
    { name: 'Chest', value: chest },
    { name: 'Waist', value: waist },
    { name: 'Hips', value: hips },
    { name: 'Left Bicep', value: leftBicep },
    { name: 'Right Bicep', value: rightBicep },
    { name: 'Right Calf', value: rightCalf },
    { name: 'Left Calf', value: leftCalf },
    { name: 'Right Thigh', value: rightThigh },
    { name: 'Left Thigh', value: leftThigh },
    { name: 'Neck', value: neck },
  ]

  useEffect(() => {
    getBodyMetrics({ latest: true }).then((bodyMetrics) => {
      setBodyFat(bodyMetrics?.bodyFat ? bodyMetrics.bodyFat?.toString() + '%' : 'N/A');
      setShoulders(bodyMetrics?.shouldersCircumference ? bodyMetrics.shouldersCircumference?.toString() : 'N/A');
      setChest(bodyMetrics?.chestCircumference ? bodyMetrics.chestCircumference?.toString() : 'N/A');
      setWaist(bodyMetrics?.waistCircumference ? bodyMetrics.waistCircumference?.toString() : 'N/A');
      setHips(bodyMetrics?.hipCircumference ? bodyMetrics.hipCircumference?.toString() : 'N/A');
      setLeftBicep(bodyMetrics?.leftBicepCircumference ? bodyMetrics.leftBicepCircumference?.toString() : 'N/A');
      setRightBicep(bodyMetrics?.rightBicepCircumference ? bodyMetrics.rightBicepCircumference?.toString() : 'N/A');
      setLeftThigh(bodyMetrics?.leftThighCircumference ? bodyMetrics.leftThighCircumference?.toString() : 'N/A');
      setRightThigh(bodyMetrics?.rightThighCircumference ? bodyMetrics.rightThighCircumference?.toString() : 'N/A');
      setLeftCalf(bodyMetrics?.leftCalfCircumference ? bodyMetrics.leftCalfCircumference?.toString() : 'N/A');
      setRightCalf(bodyMetrics?.rightCalfCircumference ? bodyMetrics.rightCalfCircumference?.toString() : 'N/A');
      setNeck(bodyMetrics?.neckCircumference ? bodyMetrics.neckCircumference?.toString() : 'N/A');
    });
  }, []);

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
