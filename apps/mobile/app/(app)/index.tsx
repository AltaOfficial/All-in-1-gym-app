import { StyleSheet, View, Text, ScrollView } from "react-native";
import React from "react";
import DashboardHero from "../../components/DashboardHero";
import FoodlogCard from "../../components/FoodlogCard";
import DashboardMetricCard from "../../components/DashboardMetricCard";
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from "expo-router"

const Dashboard = () => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
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
              value="125.0"
              subLabel="lbs"
              dateFrom="2025-08-19"
              dateTo="2025-09-19"
              onPress={() => router.push('/bodyMetrics/metricDataDates?page=weightTrend')}
            />
            <DashboardMetricCard
              title="Muscle Gain/Loss"
              value="2.43"
              subLabel="lbs"
              dateFrom="2025-08-19"
              dateTo="2025-09-19"
              onPress={() => router.push('/bodyMetrics/metricDataInfo?page=muscleGainLoss')}
            />
            <DashboardMetricCard
              title="Fat Gain/Loss"
              value="1.43"
              subLabel="lbs"
              dateFrom="2025-08-19"
              dateTo="2025-09-19"
              onPress={() => router.push('/bodyMetrics/metricDataInfo?page=fatGainLoss')}
            />
            <DashboardMetricCard
              title="Food Expenses"
              value="$19.39"
              dateFrom="2025-08-19"
              dateTo="2025-09-19"
              onPress={() => router.push('/bodyMetrics/metricDataDates?page=foodExpenses')}
            />
            <View className="w-full">
              <DashboardMetricCard
                title="Body Metrics"
                value="39.0%"
                subLabel="Body Fat"
                dateFrom="2025-08-19"
                dateTo="2025-08-31"
                className="!w-full"
                isPositive={true}
                onPress={() => router.push('/bodyMetrics')}
              />
            </View>
            <DashboardMetricCard
              title="Avg. Sleep"
              value="7.23"
              subLabel="hrs"
              dateFrom="2025-08-19"
              dateTo="2025-09-19"
              onPress={() => router.push('/bodyMetrics/metricDataInfo?page=sleep')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
