import { View, Text, Pressable } from "react-native";
import ProgressRing from "./ProgressRing";
import { useLayoutEffect, useState } from "react";
import { getCurrentUser } from "../services/getCurrentUser";
import { MetricsContext } from "../context/MetricsContext";
import { useContext } from "react";
import { router } from "expo-router";

export default function MacrosBreakdown() {
  const { metrics, refreshMetrics } = useContext(MetricsContext);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [proteinGoal, setProteinGoal] = useState(0);
  const [carbsGoal, setCarbsGoal] = useState(0);
  const [fatGoal, setFatGoal] = useState(0);

  useLayoutEffect(() => {
    const fetchData = async () => {
      setProteinGoal(metrics?.goalProtein || 0);
      setCarbsGoal(metrics?.goalCarbohydrates || 0);
      setFatGoal(metrics?.goalFat || 0);
      setProtein(metrics?.protein || 0);
      setCarbs(metrics?.carbohydrates || 0);
      setFat(metrics?.fat || 0);
    };
    fetchData();
  }, [metrics]);

  return (
    <View className=" px-4 pb-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white font-[HelveticaNeue] text-2xl">Macros</Text>
        <Pressable onPress={() => router.push('/allMacros')}>
          <Text className="text-white font-[HelveticaNeue] text-base">
            See all macros
          </Text>
        </Pressable>
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
