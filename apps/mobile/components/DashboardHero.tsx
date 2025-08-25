import { View } from "react-native";
import DashboardHeroMetrics from "./DashboardHeroMetrics";
import ProgressRing from "./ProgressRing";
import { MetricsContext } from "../context/MetricsContext";
import { useContext } from "react";

export default function DashboardHero({ className }: { className?: string }) {
  const { metrics } = useContext(MetricsContext);
  return (
    <View className={`flex-row items-center justify-between px-4 ${className}`}>
      <ProgressRing
        progress={metrics?.goalCalories ? (metrics?.currentCalories || 0) / (metrics?.goalCalories || 0) : 0}
        valueLabel={(metrics?.goalCalories || 0) - (metrics?.currentCalories || 0)}
        size={250}
        strokeWidth={12}
        valueTextSize="text-6xl"
        subtitleTextSize="text-sm"
      />
      <DashboardHeroMetrics goal={metrics?.goalCalories || 0} consumed={metrics?.currentCalories || 0} burned={metrics?.burnedCalories || 0} />
    </View>
  );
}
