import { View } from "react-native"
import DashboardHeroMetrics from './DashboardHeroMetrics';
import ProgressRing from './ProgressRing';

export default function DashboardHero({ className }: { className?: string }) {
  const goal = 2416;
  const consumed = 1800;
  const burned = 214;
  const remaining = Math.max(0, goal - consumed + burned);
  const progress = Math.max(0, Math.min(1, remaining / goal));

  return (
    <View className={`flex-row items-center justify-between px-4 ${className}`}>
      <ProgressRing progress={progress} valueLabel={remaining} size={250} strokeWidth={12} valueTextSize="text-6xl" subtitleTextSize='text-sm' />
      <DashboardHeroMetrics goal={goal} consumed={consumed} burned={burned} />
    </View>
  )
}
