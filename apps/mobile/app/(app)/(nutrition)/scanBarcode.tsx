import { Text, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraPermissions,
  CameraType,
  CameraView,
  BarcodeScanningResult,
} from "expo-camera";
import GenericButton from "../../../components/GenericButton";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

export default function ScanBarcode() {
  const [permission, requestPermission] = useCameraPermissions();
  const [fetching, setFetching] = useState(false);
  const { searchType } = useLocalSearchParams();

  console.log("searchType", searchType);

  const handleBarcodeScanned = async (event: BarcodeScanningResult) => {
    // Prevent multiple scans while fetching
    if (fetching) {
      return;
    }

    console.log("Barcode scanned: " + event.data);
    setFetching(true);

    await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/foods/search?query=${event.data}`,
      {
        headers: {
          Authorization: `Bearer ${SecureStore.getItem("jwtToken")}`,
        },
      }
    ).then(async (response) => {
      if (
        response.status == 200 &&
        response.headers.get("Content-Type") == "application/json"
      ) {
        const data = await response.json();
        if (data.length == 0) {
          console.log("No results found");
          return router.back();
        }
        if (data.length > 0) {
          const food = data[0];
          return router.push({
            pathname: "/(app)/(nutrition)/logFood",
            params: {
              addType: searchType,
              foodName: food.foodName,
              brandName: food.foodBrandName,
              servingSize: food.servingSize,
              servingSizeUnit: food.servingUnit,
              calories: food.calories,
              protein: food.protein,
              carbohydrates: food.carbohydrates,
              fat: food.fat,
              fiber: food.fiber,
              sugar: food.sugar,
              saturatedFat: food.saturatedFat,
              polyunsaturatedFat: food.polyunsaturatedFat,
              monounsaturatedFat: food.monounsaturatedFat,
              transFat: food.transFat,
              cholesterol: food.cholesterol,
              sodium: food.sodium,
              potassium: food.potassium,
            },
          });
        }
      } else {
        setFetching(false);
        return;
      }
    });
  };

  if (!permission) {
    return (
      <View>
        <Text>No permission</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-lg font-[HelveticaNeue]">
          We need your permission to access your camera
        </Text>
        <GenericButton text="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      <CameraView
        style={{ flex: 1 }}
        facing={"back"}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Barcode scanning frame */}
      <View className="absolute inset-0 justify-center items-center">
        <View className="w-64 h-40 rounded-lg">
          {/* Top-left corner */}
          <View className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg"></View>
          {/* Top-right corner */}
          <View className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg"></View>
          {/* Bottom-left corner */}
          <View className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg"></View>
          {/* Bottom-right corner */}
          <View className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg"></View>
        </View>
      </View>

      {fetching && (
        <View className="absolute top-20 left-4 right-4 bg-black/70 rounded-lg p-4">
          <Text className="text-white text-center font-[HelveticaNeue]">
            Searching for food...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
