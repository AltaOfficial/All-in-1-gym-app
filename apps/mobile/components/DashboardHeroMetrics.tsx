import { View, Text } from "react-native";
import TargetIcon from "../assets/icons/TargetIcon";
import UtensilsIcon from "../assets/icons/UtensilsIcon";
import FireIcon from "../assets/icons/FireIcon";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/getCurrentUser";

export default function DashboardHeroMetrics() {
  const [goal, setGoal] = useState(2416);
  const [consumed, setConsumed] = useState(1800);
  const [burned, setBurned] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getCurrentUser();
      setGoal(currentUser?.goalCalories || 2416);
    };
    fetchData();
  }, []);

  return (
    <View className="gap-4 pr-4">
      <View className="flex-row items-center gap-2">
        <TargetIcon height={24} width={24} fill="#F43A45" />
        <View className="flex-col">
          <Text className="text-white">Goal</Text>
          <Text className="text-white text-lg text-start font-semibold">
            {(goal ?? 2416).toLocaleString()}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <UtensilsIcon height={24} width={24} fill="#4CC3FF" />
        <View className="flex-col">
          <Text className="text-white">Consumed</Text>
          <Text className="text-white text-lg text-start font-semibold">
            {(consumed ?? 1800).toLocaleString()}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <FireIcon height={24} width={24} fill="#FF8000" />
        <View className="flex-col">
          <Text className="text-white">Burned</Text>
          <Text className="text-white text-lg text-start font-semibold">
            {(burned ?? 214).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}
