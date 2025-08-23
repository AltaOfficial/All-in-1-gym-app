import { View, Text } from "react-native";
import ProgressRing from "./ProgressRing";
import { useLayoutEffect, useState } from "react";
import { getCurrentUser } from "../services/getCurrentUser";

export default function MacrosBreakdown() {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [proteinGoal, setProteinGoal] = useState(0);
  const [carbsGoal, setCarbsGoal] = useState(0);
  const [fatGoal, setFatGoal] = useState(0);

  useLayoutEffect(() => {
    const fetchData = async () => {
      const currentUser = await getCurrentUser();
      setProteinGoal(currentUser?.goalProtein || 0);
      setCarbsGoal(currentUser?.goalCarbohydrates || 0);
      setFatGoal(currentUser?.goalFat || 0);
      setProtein(21);
      setCarbs(43);
      setFat(66);
    };
    fetchData();
  }, []);

  return (
    <View className=" px-4 pb-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white font-[HelveticaNeue] text-2xl">Macros</Text>
        <Text className="text-white font-[HelveticaNeue] text-base">
          See all macros
        </Text>
      </View>

      <View className="flex-row justify-between">
        <View className="items-center">
          <ProgressRing
            progress={protein / proteinGoal || 0}
            size={120}
            strokeWidth={7}
            valueLabel={protein}
            subtitle={`/${proteinGoal}g`}
            color="#00FF4D"
            valueTextSize="text-4xl"
            subtitleTextSize="text-sm"
            subtitleTextColor="text-white/70"
          />
          <Text className="text-white font-[HelveticaNeue] mt-2">Protein</Text>
        </View>

        <View className="items-center mx-4">
          <ProgressRing
            progress={carbs / carbsGoal || 0}
            size={120}
            strokeWidth={7}
            valueLabel={carbs}
            subtitle={`/${carbsGoal}g`}
            color="#FF861C"
            valueTextSize="text-4xl"
            subtitleTextSize="text-sm"
            subtitleTextColor="text-white/70"
          />
          <Text className="text-white font-[HelveticaNeue] mt-2">Carbs</Text>
        </View>

        <View className="items-center">
          <ProgressRing
            progress={fat / fatGoal || 0}
            size={120}
            strokeWidth={7}
            valueLabel={fat}
            subtitle={`/${fatGoal}g`}
            color="#EEF43A"
            valueTextSize="text-4xl"
            subtitleTextSize="text-sm"
            subtitleTextColor="text-white/70"
          />
          <Text className="text-white font-[HelveticaNeue] mt-2">Fat</Text>
        </View>
      </View>
    </View>
  );
}
