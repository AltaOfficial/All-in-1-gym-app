import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChevronRightIcon from "../../../assets/icons/ChevronRightIcon";
import { router } from "expo-router";
import { getBodyMetrics } from "../../../services/getBodyMetrics";
import { useIsFocused } from "@react-navigation/native";
import { BodyMetricEnum } from "../../../types/bodyMetricEnum";

interface BodyMetric {
  name: string;
  value: string;
  type: BodyMetricEnum;
}

export default function BodyMetrics() {
  const isFocused = useIsFocused();
  const [bodyFat, setBodyFat] = useState<string>("");
  const [shoulders, setShoulders] = useState<string>("");
  const [chest, setChest] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [hips, setHips] = useState<string>("");
  const [leftBicep, setLeftBicep] = useState<string>("");
  const [rightBicep, setRightBicep] = useState<string>("");
  const [leftThigh, setLeftThigh] = useState<string>("");
  const [rightThigh, setRightThigh] = useState<string>("");
  const [leftCalf, setLeftCalf] = useState<string>("");
  const [rightCalf, setRightCalf] = useState<string>("");
  const [neck, setNeck] = useState<string>("");

  const bodyMetrics: BodyMetric[] = [
    {
      name: "Body Fat",
      value: bodyFat,
      type: BodyMetricEnum.BODY_FAT,
    },
    { name: "Shoulders", value: shoulders, type: BodyMetricEnum.SHOULDERS },
    { name: "Chest", value: chest, type: BodyMetricEnum.CHEST },
    { name: "Waist", value: waist, type: BodyMetricEnum.WAIST },
    { name: "Hips", value: hips, type: BodyMetricEnum.HIPS },
    { name: "Left Bicep", value: leftBicep, type: BodyMetricEnum.LEFT_BICEP },
    {
      name: "Right Bicep",
      value: rightBicep,
      type: BodyMetricEnum.RIGHT_BICEP,
    },
    {
      name: "Right Calf",
      value: rightCalf,
      type: BodyMetricEnum.RIGHT_CALF,
    },
    { name: "Left Calf", value: leftCalf, type: BodyMetricEnum.LEFT_CALF },
    {
      name: "Right Thigh",
      value: rightThigh,
      type: BodyMetricEnum.RIGHT_THIGH,
    },
    { name: "Left Thigh", value: leftThigh, type: BodyMetricEnum.LEFT_THIGH },
    { name: "Neck", value: neck, type: BodyMetricEnum.NECK },
  ];

  useEffect(() => {
    // will refresh when the screen is focused
    if (isFocused) {
      getBodyMetrics({ latest: true }).then((bodyMetrics) => {
        setBodyFat(
          bodyMetrics?.bodyFat ? bodyMetrics.bodyFat?.toString() + "%" : "--"
        );
        setShoulders(
          bodyMetrics?.shouldersCircumference
            ? bodyMetrics.shouldersCircumference?.toString() + "in"
            : "--"
        );
        setChest(
          bodyMetrics?.chestCircumference
            ? bodyMetrics.chestCircumference?.toString() + "in"
            : "--"
        );
        setWaist(
          bodyMetrics?.waistCircumference
            ? bodyMetrics.waistCircumference?.toString() + "in"
            : "--"
        );
        setHips(
          bodyMetrics?.hipCircumference
            ? bodyMetrics.hipCircumference?.toString() + "in"
            : "--"
        );
        setLeftBicep(
          bodyMetrics?.leftBicepCircumference
            ? bodyMetrics.leftBicepCircumference?.toString() + "in"
            : "--"
        );
        setRightBicep(
          bodyMetrics?.rightBicepCircumference
            ? bodyMetrics.rightBicepCircumference?.toString() + "in"
            : "--"
        );
        setLeftThigh(
          bodyMetrics?.leftThighCircumference
            ? bodyMetrics.leftThighCircumference?.toString() + "in"
            : "--"
        );
        setRightThigh(
          bodyMetrics?.rightThighCircumference
            ? bodyMetrics.rightThighCircumference?.toString() + "in"
            : "--"
        );
        setLeftCalf(
          bodyMetrics?.leftCalfCircumference
            ? bodyMetrics.leftCalfCircumference?.toString() + "in"
            : "--"
        );
        setRightCalf(
          bodyMetrics?.rightCalfCircumference
            ? bodyMetrics.rightCalfCircumference?.toString() + "in"
            : "--"
        );
        setNeck(
          bodyMetrics?.neckCircumference
            ? bodyMetrics.neckCircumference?.toString() + "in"
            : "--"
        );
      });
    }
  }, [isFocused]);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <Pressable
          className="px-4 mb-6"
          onPress={() => router.push("/gallery")}
        >
          <View className="flex-col bg-gray1 rounded-xl p-4 gap-4">
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              View Gallery
            </Text>
            <View className="flex-row justify-between items-end">
              <View className="flex-row gap-4">
                <Image
                  source={require("../../../assets/images/gallery image 1.png")}
                  className="w-20 h-20 rounded-xl"
                />
                <Image
                  source={require("../../../assets/images/gallery image 1.png")}
                  className="w-20 h-20 rounded-xl"
                />
                <Image
                  source={require("../../../assets/images/gallery image 1.png")}
                  className="w-20 h-20 rounded-xl"
                />
              </View>
              <ChevronRightIcon height={20} width={20} fill="white" />
            </View>
          </View>
        </Pressable>

        <View className="px-4 pb-6">
          {bodyMetrics.map((metric: BodyMetric, index: number) => (
            <Pressable
              key={index}
              className="bg-gray1 rounded-xl p-4 mb-3"
              onPress={() =>
                router.push(
                  "/metricDataDisplay?metricName=" +
                    metric.name +
                    "&metricType=" +
                    metric.type
                )
              }
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
                    {metric.name}
                  </Text>
                  <Text className="text-gray3 text-sm font-[HelveticaNeue]">
                    {metric.value}
                  </Text>
                </View>
                <ChevronRightIcon height={20} width={20} fill="white" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
