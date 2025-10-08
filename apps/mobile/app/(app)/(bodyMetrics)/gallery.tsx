import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChevronLeftIcon from "../../../assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "../../../assets/icons/ChevronRightIcon";
import ChevronUpIcon from "../../../assets/icons/ChevronUpIcon";
import { getBodyMetricByDate } from "../../../services/getBodyMetricByDate";
import { addDays, format, subDays } from "date-fns";
import { useIsFocused } from "@react-navigation/native";
import { getCurrentUser } from "../../../services/getCurrentUser";
import DatePickerModal from "../../../components/DatePickerModal";

const Gallery = () => {
  const [selectedView, setSelectedView] = useState<"front" | "side">("front");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLbs, setIsLbs] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Photos
  const [frontPhotoUrl, setFrontPhotoUrl] = useState<string | null>(null);
  const [sidePhotoUrl, setSidePhotoUrl] = useState<string | null>(null);
  // body metrics
  const [weight, setWeight] = useState<string | undefined>();
  const [bodyFat, setBodyFat] = useState<number | undefined>();
  // measurements
  const [shoulders, setShoulders] = useState<string | undefined>();
  const [chest, setChest] = useState<string | undefined>();
  const [waist, setWaist] = useState<string | undefined>();
  const [hips, setHip] = useState<string | undefined>();
  const [rightBicep, setRightBicep] = useState<string | undefined>();
  const [leftBicep, setLeftBicep] = useState<string | undefined>();
  const [rightCalf, setRightCalf] = useState<string | undefined>();
  const [leftCalf, setLeftCalf] = useState<string | undefined>();
  const [rightThigh, setRightThigh] = useState<string | undefined>();
  const [leftThigh, setLeftThigh] = useState<string | undefined>();
  const [neck, setNeck] = useState<string | undefined>();
  const isFocused = useIsFocused();

  useEffect(() => {
    getCurrentUser().then((user) => {
      setIsLbs(user?.weightType === "LBS");
    });

    getBodyMetricByDate({
      date: new Date(format(selectedDate, "yyyy-MM-dd")),
    }).then((bodyMetric) => {
      setWeight(bodyMetric?.weight?.toString());
      setBodyFat(bodyMetric?.bodyFat ?? 0.0);
      setShoulders(bodyMetric?.shouldersCircumference?.toString());
      setChest(bodyMetric?.chestCircumference?.toString());
      setWaist(bodyMetric?.waistCircumference?.toString());
      setHip(bodyMetric?.hipCircumference?.toString());
      setRightBicep(bodyMetric?.rightBicepCircumference?.toString());
      setLeftBicep(bodyMetric?.leftBicepCircumference?.toString());
      setRightCalf(bodyMetric?.rightCalfCircumference?.toString());
      setLeftCalf(bodyMetric?.leftCalfCircumference?.toString());
      setRightThigh(bodyMetric?.rightThighCircumference?.toString());
      setLeftThigh(bodyMetric?.leftThighCircumference?.toString());
      setNeck(bodyMetric?.neckCircumference?.toString());

      setFrontPhotoUrl(bodyMetric?.frontPhotoUrl ?? null);
      setSidePhotoUrl(bodyMetric?.sidePhotoUrl ?? null);
    });
  }, [isFocused, selectedDate]);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-black">
      <View className="flex-row justify-between items-center bg-gray2 rounded-full w-fit mx-auto">
        <Pressable onPress={() => setSelectedView("front")}>
          <Text
            className={`text-white text-lg w-24 text-center font-[HelveticaNeue] ${
              selectedView === "front" ? "bg-primary" : "bg-gray2"
            } rounded-full py-4 px-5`}
          >
            Front
          </Text>
        </Pressable>
        <Pressable onPress={() => setSelectedView("side")}>
          <Text
            className={`text-white text-lg w-24 text-center font-[HelveticaNeue] ${
              selectedView === "side" ? "bg-primary" : "bg-gray2"
            } rounded-full py-4 px-5`}
          >
            Side
          </Text>
        </Pressable>
      </View>

      <View className="flex-row gap-4 justify-center items-center mt-10 w-96 h-96 mx-auto">
        {selectedView === "front" ? (
          <Image
            source={frontPhotoUrl ? { uri: frontPhotoUrl } : undefined}
            className="w-full h-full border-4 border-white rounded-3xl"
          />
        ) : (
          <Image
            source={sidePhotoUrl ? { uri: sidePhotoUrl } : undefined}
            className="w-full h-full border-4 border-white rounded-3xl"
          />
        )}
      </View>

      <View className="flex-row gap-4 justify-between items-center px-10 mt-10">
        <View>
          <View className="flex-row items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Weight:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {weight ? `${weight} ${isLbs ? "lbs" : "kg"}` : "--"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Right Bicep:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {rightBicep ?? "--"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Left Bicep:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {leftBicep ?? "--"}
            </Text>
          </View>
        </View>

        <View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Right Calf:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {rightCalf ?? "--"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Left Calf:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {leftCalf ?? "--"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Right Thigh:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {rightThigh ?? "--"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Left Thigh:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {leftThigh ?? "--"}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-4 justify-between items-center px-10 mt-4">
        <View>
          <View className="flex-row items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Body Fat:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {bodyFat ? `${bodyFat}%` : "--"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Shoulders:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {shoulders ?? "--"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Chest:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {chest ?? "--"}
            </Text>
          </View>
        </View>

        <View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Waist:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {waist ?? "--"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Hips:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {hips ?? "--"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Neck:{" "}
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
              {neck ?? "--"}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-col gap-2 items-center w-full mt-auto mb-10">
        <View className="flex-row px-10 gap-12 items-center">
          <Pressable
            onPress={() => setSelectedDate(subDays(selectedDate, 1))}
            className="flex-row bg-white w-10 h-10 rounded-full justify-center items-center"
          >
            <ChevronLeftIcon height={20} width={20} fill="black" />
          </Pressable>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-col items-center gap-4 justify-center"
          >
            <ChevronUpIcon height={20} width={20} fill="white" />
            <Text className="text-white text-lg font-[HelveticaNeue]">
              {format(selectedDate, "LLL d, yyyy")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedDate(addDays(selectedDate, 1))}
            className="flex-row bg-white w-10 h-10 rounded-full justify-center items-center"
          >
            <ChevronRightIcon height={20} width={20} fill="black" />
          </Pressable>
        </View>
      </View>

      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </SafeAreaView>
  );
};

export default Gallery;
