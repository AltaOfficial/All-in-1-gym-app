import { Text, Pressable, View } from 'react-native'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'

const FoodSearchItem = ({ foodName, calories, brandName, servingSize, servingSizeUnit, onPress }: { foodName: string, calories: number, brandName?: string, servingSize: number, servingSizeUnit: string, onPress: () => void }) => {
  const { user } = useContext(UserContext);

  return (
    <Pressable onPress={onPress} className="flex-row items-center justify-between bg-gray1 rounded-xl p-4 mb-3">
      <View className="flex-1">
        <Text className="text-white text-base font-[HelveticaNeue] mb-1">{foodName}</Text>
        <Text className="text-gray3 text-sm font-[HelveticaNeue]">{calories} {user?.weightType === "KGS" ? "kcal" : "cal"}, {brandName ? brandName + ", " : ""}{servingSize} {servingSizeUnit}</Text>
      </View>
      <Pressable className="w-10 h-10 bg-gray2 rounded-full items-center justify-center">
        <Text className="text-red-500 text-2xl text-center">+</Text>
      </Pressable>
    </Pressable>
  )
}
export default FoodSearchItem