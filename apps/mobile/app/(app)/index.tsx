import { StyleSheet, View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import DashboardHero from "../../components/DashboardHero";
import FoodlogCard from "../../components/FoodlogCard";
import DashboardMetricCard from "../../components/DashboardMetricCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { format, subDays, subWeeks, differenceInDays } from "date-fns";
import { BodyMetricEnum } from "../../types/bodyMetricEnum";
import { getBodyMetricsWithDateRange } from "../../services/getBodyMetricsWithDateRange";
import { BodyMetricsLogType } from "../../types/BodyMetricsLogType";
import { fatMassChange } from "../../utils/fatGainLossUtils";
import { leanBodyMassChange } from "../../utils/muscleGainUtils";
import { totalFoodExpenses } from "../../utils/foodExpensesUtils";
import { GroceryListItemType } from "../../types/groceryListItemType";
import { getGroceryListWithDateRange } from "../../services/getGroceryListWithDateRange";

// TODO: By default, show data from the past 2 weeks up to today.
// In the future, make this date range configurable in the settings.
const Dashboard = () => {
  const [bodyMetricsCurrentPeriod, setBodyMetricsCurrentPeriod] = useState<
    BodyMetricsLogType[]
  >([]);
  const [bodyMetricsPreviousPeriod, setBodyMetricsPreviousPeriod] = useState<
    BodyMetricsLogType[]
  >([]);
  const [weightAverage, setWeightAverage] = useState<number>(0);
  const [foodExpenses, setFoodExpenses] = useState<GroceryListItemType[]>([]);
  const startDate = subWeeks(new Date(), 2).toISOString();
  const endDate = new Date().toISOString();

  useEffect(() => {
    const differenceInDates = differenceInDays(endDate, startDate);
    getBodyMetricsWithDateRange({
      startDate: startDate,
      endDate: endDate,
    }).then((data) => {
      setBodyMetricsCurrentPeriod(data || []);
      getBodyMetricsWithDateRange({
        startDate: format(subDays(startDate, differenceInDates), "yyyy-MM-dd"),
        endDate: format(startDate, "yyyy-MM-dd"),
      }).then((data) => {
        setBodyMetricsPreviousPeriod(data || []);
      });

      let weightAverage = 0;
      let bodyMetricsWithDefinedWeight = 0;
      data?.forEach((bodyMetric) => {
        if (bodyMetric.weight) {
          bodyMetricsWithDefinedWeight++;
          weightAverage += bodyMetric.weight;
        }
      });
      setWeightAverage(
        Number((weightAverage / bodyMetricsWithDefinedWeight).toFixed(1))
      );
    });
    getGroceryListWithDateRange({
      startDate: startDate,
      endDate: endDate,
    }).then((data) => {
      setFoodExpenses(data || []);
    });
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-black">
      <ScrollView className="bg-black flex-1">
        <Text className="font-[HelveticaNeueBoldItalic] text-[3rem] text-white mb-12 text-center">
          strive.
        </Text>
        <DashboardHero className="mb-8 gap-6" />
        <FoodlogCard />
        <View className="px-3 mt-4">
          <View className="flex-row flex-wrap justify-between">
            <DashboardMetricCard
              title="Weight Trend"
              value={weightAverage > 0 ? weightAverage.toString() : "--"}
              subLabel="lbs"
              metricType={BodyMetricEnum.WEIGHT}
              dateFrom={startDate}
              dateTo={endDate}
              onPress={() =>
                router.push(
                  "/(bodyMetrics)/metricDataDisplay?metricType=weight&metricName=Weight Trend"
                )
              }
            />
            <DashboardMetricCard
              title="Muscle Gain/Loss"
              isPositive={
                leanBodyMassChange(bodyMetricsCurrentPeriod).toFixed(1) ==
                  "-0.0" ||
                leanBodyMassChange(bodyMetricsCurrentPeriod).toFixed(1) == "0.0"
                  ? undefined
                  : leanBodyMassChange(bodyMetricsCurrentPeriod) < 0.0
                    ? false
                    : true
              }
              isGood={leanBodyMassChange(bodyMetricsCurrentPeriod) > 0}
              value={
                leanBodyMassChange(bodyMetricsCurrentPeriod) !== 0
                  ? leanBodyMassChange(bodyMetricsCurrentPeriod) == 0 ||
                    leanBodyMassChange(bodyMetricsCurrentPeriod)
                      .toString()
                      .split(".")[1][0] === "0"
                    ? "0"
                    : leanBodyMassChange(bodyMetricsCurrentPeriod)
                        .toFixed(1)
                        .toString()
                  : "--"
              }
              subLabel="lbs"
              metricType={BodyMetricEnum.MUSCLE_GAIN_LOSS}
              dateFrom={startDate}
              dateTo={endDate}
              onPress={() =>
                router.push(
                  "/(bodyMetrics)/metricDataDisplay?metricType=muscleGainLoss&metricName=Muscle Gain/Loss"
                )
              }
            />
            <DashboardMetricCard
              title="Fat Gain/Loss"
              isPositive={
                fatMassChange(bodyMetricsCurrentPeriod).toFixed(1) == "-0.0" ||
                fatMassChange(bodyMetricsCurrentPeriod).toFixed(1) == "0.0"
                  ? undefined
                  : fatMassChange(bodyMetricsCurrentPeriod) < 0.0
                    ? false
                    : true
              }
              isGood={fatMassChange(bodyMetricsCurrentPeriod) < 0}
              value={
                fatMassChange(bodyMetricsCurrentPeriod) !== 0
                  ? fatMassChange(bodyMetricsCurrentPeriod) == 0 ||
                    fatMassChange(bodyMetricsCurrentPeriod)
                      .toString()
                      .split(".")[1][0] === "0"
                    ? "0"
                    : fatMassChange(bodyMetricsCurrentPeriod)
                        .toFixed(1)
                        .toString()
                  : "--"
              }
              subLabel="lbs"
              metricType={BodyMetricEnum.FAT_GAIN_LOSS}
              dateFrom={startDate}
              dateTo={endDate}
              onPress={() =>
                router.push(
                  "/(bodyMetrics)/metricDataDisplay?metricType=fatGainLoss&metricName=Fat Gain/Loss"
                )
              }
            />
            <DashboardMetricCard
              title="Food Expenses"
              value={
                totalFoodExpenses(foodExpenses) > 0
                  ? "$" + totalFoodExpenses(foodExpenses).toFixed(1).toString()
                  : "--"
              }
              metricType={BodyMetricEnum.FOOD_EXPENSES}
              dateFrom={startDate}
              dateTo={endDate}
              onPress={() =>
                router.push(
                  "/(bodyMetrics)/metricDataDisplay?metricType=foodExpenses&metricName=Food Expenses"
                )
              }
            />
            <View className="w-full">
              <DashboardMetricCard
                title="Body Metrics"
                value={
                  bodyMetricsCurrentPeriod.filter(
                    (bodyMetric) => bodyMetric.bodyFat
                  ).length > 0
                    ? (
                        bodyMetricsCurrentPeriod.reduce((acc, bodyMetric) => {
                          if (bodyMetric.bodyFat) {
                            return acc + bodyMetric.bodyFat;
                          }
                          return acc;
                        }, 0) /
                        bodyMetricsCurrentPeriod.filter(
                          (bodyMetric) => bodyMetric.bodyFat
                        ).length
                      )
                        .toFixed(1)
                        .toString() + "%"
                    : "--"
                }
                subLabel="Body Fat"
                dateFrom={startDate}
                dateTo={endDate}
                className="!w-full"
                // isPositive={true}
                onPress={() => router.push("/bodyMetrics")}
              />
            </View>

            {/* not implemented anywhere, in the future ill add health app integration to define this */}
            <DashboardMetricCard
              title="Avg. Sleep"
              value="--"
              subLabel="hrs"
              metricType={BodyMetricEnum.SLEEP}
              dateFrom={startDate}
              dateTo={endDate}
              onPress={() =>
                router.push(
                  "/(bodyMetrics)/metricDataDisplay?metricType=sleep&metricName=Avg. Sleep"
                )
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
