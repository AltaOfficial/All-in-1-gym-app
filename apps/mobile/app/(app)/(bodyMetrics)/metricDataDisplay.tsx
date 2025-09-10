import { ScrollView, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { useEffect, useState } from "react";
import Separator from "../../../components/Separator";
import { SafeAreaView } from "react-native-safe-area-context";
import BodyMetricsChart from "../../../components/BodyMetricsChart";
import { useLocalSearchParams } from "expo-router";
import { BodyMetricsLogType } from "../../../types/BodyMetricsLogType";
import { getBodyMetricsWithDateRange } from "../../../services/getBodyMetricsWithDateRange";
import {
  format,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  startOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  startOfDecade,
  differenceInDays,
  subDays,
  addDays,
} from "date-fns";
import { BodyMetricEnum } from "../../../types/bodyMetricEnum";
import { totalFoodExpenses } from "../../../utils/foodExpensesUtils";
import { getGroceryListWithDateRange } from "../../../services/getGroceryListWithDateRange";
import { GroceryListItemType } from "../../../types/groceryListItemType";
import { leanBodyMassChange } from "../../../utils/muscleGainUtils";
import { fatMassChange } from "../../../utils/fatGainLossUtils";

const metricDataDates = () => {
  const { metricName, metricType, page } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>("1W");
  const [unitType, setUnitType] = useState<string>("in");
  const [datesData, setDatesData] = useState<
    BodyMetricsLogType[] | GroceryListItemType[]
  >([]);
  const [average, setAverage] = useState<number>(0);
  const [difference, setDifference] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(
    format(startOfWeek(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(addDays(endOfWeek(new Date()), 1), "yyyy-MM-dd")
  );

  useEffect(() => {
    switch (metricType) {
      case BodyMetricEnum.BODY_FAT:
        setUnitType("%");
        break;
      case BodyMetricEnum.WEIGHT:
      case BodyMetricEnum.MUSCLE_GAIN_LOSS:
      case BodyMetricEnum.FAT_GAIN_LOSS:
        setUnitType("lbs");
        break;
      case BodyMetricEnum.FOOD_EXPENSES:
        setUnitType("$");
        break;
      case BodyMetricEnum.SLEEP:
        setUnitType("hrs");
        break;
    }

    if (metricType === BodyMetricEnum.FOOD_EXPENSES) {
      getGroceryListWithDateRange({
        startDate: startDate,
        endDate: format(endDate, "yyyy-MM-dd"),
      }).then((data) => {
        let secondHalfTotal = totalFoodExpenses(data ?? []);

        setDatesData(data ?? []);
        setAverage(secondHalfTotal);
        getGroceryListWithDateRange({
          startDate: format(
            subDays(startDate, differenceInDays(endDate, startDate)),
            "yyyy-MM-dd"
          ),
          endDate: format(subDays(startDate, 1), "yyyy-MM-dd"),
        }).then(async (data) => {
          if (data && data.length > 0) {
            let firstHalfTotal = totalFoodExpenses(data ?? []);
            setDifference(secondHalfTotal - firstHalfTotal);
          } else {
            setDifference(secondHalfTotal - 0);
          }
        });
      });
    } else {
      getBodyMetricsWithDateRange({
        startDate: startDate,
        endDate: endDate,
      }).then(async (bodyMetrics) => {
        if (bodyMetrics) {
          const differenceInDates = differenceInDays(endDate, startDate);

          // Calculate the number of days between startDate and endDate.
          // We'll use this value to fetch data for the previous period of the same length,
          // so we can compare the current period's metrics to the previous period's metrics.
          const firstHalf = await getBodyMetricsWithDateRange({
            startDate: format(
              subDays(startDate, differenceInDates),
              "yyyy-MM-dd"
            ),
            endDate: format(subDays(startDate, 1), "yyyy-MM-dd"),
          });

          if (metricType === BodyMetricEnum.MUSCLE_GAIN_LOSS) {
            // get total for first half
            const firstHalfTotal = leanBodyMassChange(firstHalf ?? []);
            // get total for second half
            const secondHalfTotal = leanBodyMassChange(bodyMetrics ?? []);
            setAverage(secondHalfTotal);
            setDatesData(bodyMetrics ?? []);
            // set difference
            setDifference(secondHalfTotal - firstHalfTotal);
          } else if (metricType == BodyMetricEnum.FAT_GAIN_LOSS) {
            // get total for first half
            const firstHalfTotal = fatMassChange(firstHalf ?? []);
            // get total for second half
            const secondHalfTotal = fatMassChange(bodyMetrics ?? []);
            setAverage(secondHalfTotal);
            setDatesData(bodyMetrics ?? []);
            // set difference
            setDifference(secondHalfTotal - firstHalfTotal);
          } else {
            // these are just to make sure we're not displaying any zero values
            const validMetricsForFirstHalf = firstHalf?.filter(
              (bodyMetric) =>
                (bodyMetric[metricType as keyof BodyMetricsLogType] as number) >
                0
            );
            const validMetricsForSecondHalf = bodyMetrics.filter(
              (bodyMetric) =>
                (bodyMetric[metricType as keyof BodyMetricsLogType] as number) >
                0
            );
            // since we only want to display the second half, we set the dates data to the second half
            setDatesData(validMetricsForSecondHalf);

            // getting and setting the average to the second half, since thats the data we're viewing
            const secondHalfAverage =
              validMetricsForSecondHalf && validMetricsForSecondHalf.length > 0
                ? validMetricsForSecondHalf.reduce(
                    (acc, bodyMetric) =>
                      acc +
                      (bodyMetric[
                        metricType as keyof BodyMetricsLogType
                      ] as number),
                    0
                  ) / validMetricsForSecondHalf.length
                : 0;
            setAverage(secondHalfAverage);

            // now getting the difference between the first half and the second half averages
            if (
              validMetricsForFirstHalf &&
              validMetricsForFirstHalf.length > 0
            ) {
              const firstHalfAverage =
                validMetricsForFirstHalf.reduce(
                  (acc, bodyMetric) =>
                    acc +
                    (bodyMetric[
                      metricType as keyof BodyMetricsLogType
                    ] as number),
                  0
                ) / validMetricsForFirstHalf.length;
              setDifference(secondHalfAverage - firstHalfAverage);
            } else {
              setDifference(secondHalfAverage - 0);
            }
          }
        }
      });
    }
  }, [metricName, startDate, endDate]);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-black">
      <View className="px-4 mb-4 flex-row items-center justify-center gap-2">
        <Svg width={20} height={20}>
          <Path
            d="M10 10 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0"
            stroke="#F43A45"
            strokeWidth={2}
            fill="none"
          />
        </Svg>
        <Text className="text-white text-lg font-[HelveticaNeue]">
          {metricName}
        </Text>
      </View>

      <View className="flex-row items-center justify-between gap-2 px-6">
        <Text className="text-white font-[HelveticaNeue]">
          {metricType === BodyMetricEnum.FOOD_EXPENSES ||
          metricType === BodyMetricEnum.MUSCLE_GAIN_LOSS ||
          metricType === BodyMetricEnum.FAT_GAIN_LOSS
            ? "Total"
            : "Average"}
          :{" "}
          <Text className="text-white font-bold font-[HelveticaNeue]">
            {average.toFixed(1)}
            {unitType}
          </Text>
        </Text>
        <Text className="text-white font-[HelveticaNeue]">
          Difference:{" "}
          <Text className="text-white font-bold font-[HelveticaNeue]">
            {difference > 0 ? "+" : ""}
            {difference.toFixed(1)}
            {unitType}
          </Text>
        </Text>
      </View>

      <View>
        <BodyMetricsChart
          metricType={metricType as BodyMetricEnum}
          data={datesData}
          width={400}
          height={400}
          startDate={startDate}
          endDate={endDate}
          selectedDate={selectedDate}
        />
        <View className="flex-col items-center gap-4">
          <View className="flex-row justify-between gap-6 px-6 mt-4">
            <Text
              className={`font-[HelveticaNeue] font-medium py-1 px-3 ${selectedDate === "1W" ? "text-black bg-white rounded-full" : "text-white"}`}
              onPress={() => {
                setStartDate(format(startOfWeek(new Date()), "yyyy-MM-dd"));
                setEndDate(format(endOfWeek(new Date()), "yyyy-MM-dd"));
                setSelectedDate("1W");
              }}
            >
              1W
            </Text>
            <Text
              className={` font-[HelveticaNeue] font-medium py-1 px-3 ${selectedDate === "1M" ? "text-black bg-white rounded-full" : "text-white"}`}
              onPress={() => {
                setStartDate(format(startOfMonth(new Date()), "yyyy-MM-dd"));
                setEndDate(format(endOfMonth(new Date()), "yyyy-MM-dd"));
                setSelectedDate("1M");
              }}
            >
              1M
            </Text>
            <Text
              className={` font-[HelveticaNeue] font-medium py-1 px-3 ${selectedDate === "3M" ? "text-black bg-white rounded-full" : "text-white"}`}
              onPress={() => {
                setStartDate(
                  format(subMonths(startOfMonth(new Date()), 3), "yyyy-MM-dd")
                );
                setEndDate(format(endOfMonth(new Date()), "yyyy-MM-dd"));
                setSelectedDate("3M");
              }}
            >
              3M
            </Text>
            <Text
              className={`font-[HelveticaNeue] font-medium py-1 px-3 ${selectedDate === "6M" ? "text-black bg-white rounded-full" : "text-white"}`}
              onPress={() => {
                setStartDate(
                  format(subMonths(startOfMonth(new Date()), 5), "yyyy-MM-dd")
                );
                setEndDate(format(endOfMonth(new Date()), "yyyy-MM-dd"));
                setSelectedDate("6M");
              }}
            >
              6M
            </Text>
            <Text
              className={`font-[HelveticaNeue] font-medium py-1 px-3 ${selectedDate === "1Y" ? "text-black bg-white rounded-full" : "text-white"}`}
              onPress={() => {
                setStartDate(format(startOfYear(new Date()), "yyyy-MM-dd"));
                setEndDate(format(endOfYear(new Date()), "yyyy-MM-dd"));
                setSelectedDate("1Y");
              }}
            >
              1Y
            </Text>
            <Text
              className={`font-[HelveticaNeue] font-medium py-1 px-3 ${selectedDate === "All" ? "text-black bg-white rounded-full" : "text-white"}`}
              onPress={() => {
                setStartDate(format(startOfDecade(new Date()), "yyyy-MM-dd"));
                setEndDate(format(endOfYear(new Date()), "yyyy-MM-dd"));
                setSelectedDate("All");
              }}
            >
              All
            </Text>
          </View>
          {/* <ChevronDownIcon height={20} width={20} fill="white" /> */}
        </View>
      </View>

      <Separator className="h-[0.4px] mt-6" />

      {metricType !== BodyMetricEnum.FOOD_EXPENSES &&
      metricType !== BodyMetricEnum.SLEEP &&
      metricType !== BodyMetricEnum.MUSCLE_GAIN_LOSS &&
      metricType !== BodyMetricEnum.FAT_GAIN_LOSS ? (
        <ScrollView>
          {(() => {
            const filteredData = datesData.filter(
              (date) =>
                ((date as BodyMetricsLogType)[
                  metricType as keyof BodyMetricsLogType
                ] as number) > 0
            );

            return filteredData.length > 0 ? (
              filteredData.reverse().map((date, index) => {
                return (
                  <View key={index} className="flex-col justify-center">
                    <View className="flex-row justify-between items-center px-6 py-4">
                      <Text className="text-white font-[HelveticaNeue]">
                        {new Date(
                          (date as BodyMetricsLogType).id.date
                        ).toLocaleDateString()}
                      </Text>
                      <Text className="text-white font-[HelveticaNeue]">
                        {((date as BodyMetricsLogType)[
                          metricType as keyof BodyMetricsLogType
                        ] as number) || 0}{" "}
                        {unitType}
                      </Text>
                    </View>
                    {index !== filteredData.length - 1 && (
                      <Separator className="h-[0.4px]" />
                    )}
                  </View>
                );
              })
            ) : (
              <View className="flex-col justify-center items-center mt-4">
                <Text className="text-white font-[HelveticaNeue]">
                  No data to show
                </Text>
              </View>
            );
          })()}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};
export default metricDataDates;
