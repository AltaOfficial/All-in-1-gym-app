import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type ProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0..1
  valueLabel: string | number;
  subtitle?: string;
  color?: string;
  valueTextSize?: string;
  subtitleTextSize?: string;
  valueTextColor?: string;
  subtitleTextColor?: string;
};

export default function ProgressRing({
  size = 280,
  strokeWidth = 16,
  progress,
  valueLabel,
  subtitle = 'Remaining',
  color = '#F43A45',
  valueTextSize = 'text-2xl',
  subtitleTextSize = 'text-xs',
  valueTextColor = 'text-white',
  subtitleTextColor = 'text-white',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={'#27272A'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
             <View className="absolute items-center justify-center">
         <Text className={`${valueTextColor} font-bold ${valueTextSize}`}>{valueLabel}</Text>
         {subtitle ? (
           <Text className={`${subtitleTextColor} ${subtitleTextSize}`}>{subtitle}</Text>
         ) : null}
       </View>
    </View>
  );
}


