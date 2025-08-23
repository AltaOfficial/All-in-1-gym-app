import { View, Text, Pressable } from "react-native";

export default function WeightMetricSelector({
  className,
  isLbs = true,
  setIsLbs,
}: {
  className?: string;
  isLbs?: boolean;
  setIsLbs?: (isLbs: boolean) => void;
}) {
  return (
    <View
      className={`flex-row items-center justify-between gap-2 bg-gray2 rounded-lg ${className}`}
    >
      <Pressable
        className={`w-18 h-9 rounded-lg flex items-center justify-center ${
          isLbs ? "bg-primary" : "bg-gray2"
        }`}
        onPress={() => setIsLbs?.(true)}
      >
        <Text className="font-[HelveticaNeue] text-white text-xl px-5 rounded-lg">
          Lb
        </Text>
      </Pressable>
      <Pressable
        className={`w-18 h-9 rounded-lg flex items-center justify-center ${
          isLbs ? "bg-gray2" : "bg-primary"
        }`}
        onPress={() => setIsLbs?.(false)}
      >
        <Text className="font-[HelveticaNeue] text-white text-xl px-5 rounded-lg">
          Kg
        </Text>
      </Pressable>
    </View>
  );
}
