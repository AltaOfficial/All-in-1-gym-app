import { View, Text } from "react-native";
import ProgressRing from "./ProgressRing";

export default function MacrosBreakdown() {
  return (
         <View className=" px-4 pb-6">
                 <View className="flex-row justify-between items-center mb-6">
             <Text className="text-white font-[HelveticaNeue] text-2xl">
             Macros
             </Text>
             <Text className="text-white font-[HelveticaNeue] text-base">
             See all macros
             </Text>
         </View>

    <View className="flex-row justify-between">
        <View className="items-center">
           <ProgressRing
             progress={111/237}
             size={120}
             strokeWidth={7}
             valueLabel="111"
             subtitle="/237g"
             color="#00FF4D"
             valueTextSize="text-4xl"
             subtitleTextSize="text-sm"
             subtitleTextColor="text-white/70"
           />
           <Text className="text-white font-[HelveticaNeue] mt-2">Protein</Text>
         </View>
         
         <View className="items-center mx-4">
           <ProgressRing
             progress={43/63}
             size={120}
             strokeWidth={7}
             valueLabel="43"
             subtitle="/63g"
             color="#FF861C"
             valueTextSize="text-4xl"
             subtitleTextSize="text-sm"
             subtitleTextColor="text-white/70"
           />
           <Text className="text-white font-[HelveticaNeue] mt-2">Carbs</Text>
         </View>
         
         <View className="items-center">
           <ProgressRing
             progress={66/93}
             size={120}
             strokeWidth={7}
             valueLabel="66"
             subtitle="/93g"
             color="#EEF43A"
             valueTextSize="text-4xl"
             subtitleTextSize="text-sm"
             subtitleTextColor="text-white/70"
           />
           <Text className="text-white font-[HelveticaNeue] mt-2">Fat</Text>
         </View>
      </View>
    </View>
  )
}