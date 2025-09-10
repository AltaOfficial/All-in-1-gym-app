import { Pressable, Text, View } from "react-native";
import ChevronRightIcon from "../assets/icons/ChevronRightIcon";
import ArrowDownIcon from "../assets/icons/ArrowDownIcon";
import ArrowUpIcon from "../assets/icons/ArrowUpIcon";
import { BodyMetricEnum } from "../types/bodyMetricEnum";
import { format, isToday } from "date-fns";

type Props = {
  title: string;
  value: string;
  subLabel?: string;
  dateFrom: string;
  dateTo: string;
  isPositive?: boolean;
  isGood?: boolean;
  metricType?: BodyMetricEnum;
  onPress?: () => void;
  className?: string;
};

export default function DashboardMetricCard({
  title,
  value,
  subLabel,
  dateFrom,
  dateTo,
  isPositive,
  isGood,
  className,
  onPress,
}: Props) {
  return (
    <Pressable
      className={`bg-gray1 rounded-xl p-4 mb-4 ${className}`}
      style={{ width: "48%" }}
      onPress={onPress}
      android_ripple={{ color: "#27272A" }}
    >
      <View>
        <Text className="text-white font-semibold">{title}</Text>
        <Text className="text-white/60 text-xs mt-1">
          {formatDateRangeWithDateFns(dateFrom, dateTo)}
        </Text>
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <View className="flex-row gap-1">
          {isPositive ? (
            <ArrowUpIcon
              height={10}
              width={10}
              fill={
                isGood === true
                  ? "#00FF4D"
                  : isGood === false
                    ? "#F43A45"
                    : "white"
              }
            />
          ) : isPositive === false ? (
            <ArrowDownIcon
              height={10}
              width={10}
              fill={
                isGood === true
                  ? "#00FF4D"
                  : isGood === false
                    ? "#F43A45"
                    : "white"
              }
            />
          ) : null}
          <View className="flex-row gap-1 items-baseline">
            <Text className="text-white text-xl font-bold">{value}</Text>
            {subLabel ? (
              <Text className="text-white/70 text-sm">{subLabel}</Text>
            ) : null}
          </View>
        </View>
        <ChevronRightIcon height={18} width={18} fill="white" />
      </View>
    </Pressable>
  );
}

function formatDateRangeWithDateFns(from: string, to: string): string {
  if (!from || !to) return "";

  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const fromStr = format(fromDate, "d MMM");
    const toStr = isToday(toDate) ? "Today" : format(toDate, "d MMM");

    return `${fromStr} - ${toStr}`;
  } catch {
    return `${from} - ${to}`;
  }
}
