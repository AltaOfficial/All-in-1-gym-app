import { View } from "react-native";
import DashboardHeroMetrics from "./DashboardHeroMetrics";
import ProgressRing from "./ProgressRing";

export default function DashboardHero({ className }: { className?: string }) {
  return (
    <View className={`flex-row items-center justify-between px-4 ${className}`}>
      <ProgressRing
        progress={0.5}
        valueLabel={100}
        size={250}
        strokeWidth={12}
        valueTextSize="text-6xl"
        subtitleTextSize="text-sm"
      />
      <DashboardHeroMetrics />
    </View>
  );
}
