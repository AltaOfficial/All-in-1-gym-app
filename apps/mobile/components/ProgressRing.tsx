import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type ProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  progress?: number; // 0..1
  valueLabel: string | number;
  subtitle?: string;
  color?: string;
  valueTextSize?: string;
  subtitleTextSize?: string;
  valueTextColor?: string;
  subtitleTextColor?: string;
  macrosFull?: boolean;
  carbs?: number;
  fat?: number;
  protein?: number;
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
  macrosFull = false,
  carbs = 0,
  fat = 0,
  protein = 0,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress || 0));
  const strokeDashoffset = circumference * (1 - clamped);

  // Calculate macro percentages for segmented ring
  const totalMacros = Number(carbs) + Number(fat) + Number(protein);
  const carbsPercentage = totalMacros > 0 ? (carbs / totalMacros) * 100 : 0;
  const fatPercentage = totalMacros > 0 ? (fat / totalMacros) * 100 : 0;
  const proteinPercentage = totalMacros > 0 ? (protein / totalMacros) * 100 : 0;

  // Calculate stroke dash arrays for segments
  const carbsDash = (carbsPercentage / 100) * circumference;
  const fatDash = (fatPercentage / 100) * circumference;
  const proteinDash = (proteinPercentage / 100) * circumference;

  // Calculate starting positions with gaps
  const gapSize = 4; // gap in pixels
  const gapAngle = (gapSize / radius) * (180 / Math.PI); // convert to degrees
  
  const carbsStart = 0;
  const fatStart = (carbsPercentage / 100) * 360 + gapAngle;
  const proteinStart = fatStart + (fatPercentage / 100) * 360 + gapAngle;

  const center = size / 2;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        {!macrosFull && <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={'#27272A'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />}
        
        {macrosFull ? (
          // Segmented ring for macros
          <>
            {/* Carbs segment (orange) */}
            {carbsPercentage > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#FF861C"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${carbsDash} ${circumference}`}
                strokeDashoffset={0}
                transform={`rotate(${carbsStart}, ${center}, ${center})`}
              />
            )}
            
            {/* Fat segment (yellow) */}
            {Number(fatPercentage.toFixed(0)) > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#EEF43A"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${fatDash} ${circumference}`}
                strokeDashoffset={0}
                transform={`rotate(${fatStart}, ${center}, ${center})`}
              />
            )}
            
            {/* Protein segment (green) */}
            {Number(proteinPercentage.toFixed(0)) > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#00FF4D"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${proteinDash} ${circumference}`}
                strokeDashoffset={0}
                transform={`rotate(${proteinStart}, ${center}, ${center})`}
              />
            )}
          </>
        ) : (
          // Single progress ring
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        )}
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


