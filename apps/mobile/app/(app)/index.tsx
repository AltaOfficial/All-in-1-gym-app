import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";
import DashboardHero from "../../components/DashboardHero";
import FoodlogCard from "../../components/FoodlogCard";
import DashboardMetricCard from "../../components/DashboardMetricCard";

const Dashboard = () => {
  return (
    <ScrollView className="bg-black flex-1">
      <Text className="font-[HelveticaNueueBoldItalic] text-[3rem] text-white mb-12 text-center">
        strive.
      </Text>
      <DashboardHero className="mb-8 gap-6" />
      <Pressable onPress={async () => {
        await fetch("http://192.168.55.119:8000/hello")
        .then(async data => {
          console.log(await data.text());
        })
        .catch(error => {
          console.error(error);
        });
      }}>
        <Text className="text-white">
          test
        </Text>
      </Pressable>
      <FoodlogCard />
      <View className="px-3 mt-4">
        <View className="flex-row flex-wrap justify-between">
          <DashboardMetricCard title="Weight Trend" value="125.0" subLabel="lbs" dateFrom="2025-08-19" dateTo="2025-09-19" />
          <DashboardMetricCard title="Muscle Gain/Loss" value="2.43" subLabel="lbs" dateFrom="2025-08-19" dateTo="2025-09-19" />
          <DashboardMetricCard title="Fat Gain/Loss" value="1.43" subLabel="lbs" dateFrom="2025-08-19" dateTo="2025-09-19" />
          <DashboardMetricCard title="Food Expenses" value="$19.39" dateFrom="2025-08-19" dateTo="2025-09-19" />
          <DashboardMetricCard title="Body Metrics" value="39.0%" subLabel="Body Fat" dateFrom="2025-08-19" dateTo="2025-09-19" />
          <DashboardMetricCard title="Avg. Sleep" value="7.23" subLabel="hrs" dateFrom="2025-08-19" dateTo="2025-09-19" />
        </View>
      </View>
    </ScrollView>

  );
};

export default Dashboard;

const styles = StyleSheet.create({});
