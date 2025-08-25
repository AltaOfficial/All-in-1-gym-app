import { Text, View } from 'react-native'

const MacroProgressBar = ({ title, barClassName, current, goal, unit }: { title: string, barClassName?: string, current: number, goal: number, unit: string }) => {
  
  // Mock data for now - replace with actual metrics data
  const leftProtein = goal - current;
  const progressPercentage = ((current / goal) * 100) || 0;

  return (
    <View className="px-6 py-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-[HelveticaNeue] text-base">
          {title}
        </Text>
        <View className=" flex-row justify-end">
          <Text className="text-white font-[HelveticaNeue] text-base w-20 text-right">
            {current}
          </Text>
          <Text className="text-white font-[HelveticaNeue] text-base w-20 text-right">
            {goal}
          </Text>
          <Text className="text-white font-[HelveticaNeue] text-base w-20 text-right">
            {leftProtein}{unit}
          </Text>
        </View>
      </View>
      
      <View className="w-full h-[0.45rem] bg-[#D9D9D9] rounded-full">
        <View 
          className={`h-[0.45rem] w-full bg-black/10 rounded-full ${barClassName ? barClassName : 'bg-gray2'}`}
          style={{ width: `${progressPercentage}%` }}
        />
        <View 
          className="absolute top-0 bottom-0 w-[3.5px] bg-black"
          style={{ left: `${progressPercentage - 1}%` }}
        />
      </View>
    </View>
  )
}

export default MacroProgressBar