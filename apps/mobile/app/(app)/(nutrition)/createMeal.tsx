import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EditIcon from "../../../assets/icons/EditIcon";
import ProgressRing from "../../../components/ProgressRing";
import Separator from "../../../components/Separator";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import GenericButton from "../../../components/GenericButton";
import { MealContext } from "../../../context/MealContext";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { ImagePickerPressable } from "../../../components/ImagePickerPressable";

const CreateMeal = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [mealName, setMealName] = useState<string>("");
  const { mealItems } = useContext(MealContext);

  const toSignificantFigures = (num: number, sigFigs: number = 2) => {
    if (num === 0 || num === null || num === undefined || isNaN(num)) return 0;
    const magnitude = Math.floor(Math.log10(Math.abs(num))) + 1;
    const multiplier = Math.pow(10, sigFigs - magnitude);
    return Math.round(num * multiplier) / multiplier;
  };
  const [caloriesLabel, setCaloriesLabel] = useState(
    mealItems.reduce((acc, item) => acc + (item.calories ?? 0), 0).toFixed(0)
  );
  const [carbsLabel, setCarbsLabel] = useState(
    toSignificantFigures(
      mealItems.reduce((acc, item) => acc + (item.carbohydrates ?? 0), 0)
    )
  );
  const [fatLabel, setFatLabel] = useState(
    toSignificantFigures(
      mealItems.reduce((acc, item) => acc + (item.fat ?? 0), 0)
    )
  );
  const [proteinLabel, setProteinLabel] = useState(
    toSignificantFigures(
      mealItems.reduce((acc, item) => acc + (item.protein ?? 0), 0)
    )
  );
  const adjustedCarbohydrates = mealItems.reduce(
    (acc, item) => acc + (item.carbohydrates ?? 0),
    0
  );
  const adjustedFat = mealItems.reduce((acc, item) => acc + (item.fat ?? 0), 0);
  const adjustedProtein = mealItems.reduce(
    (acc, item) => acc + (item.protein ?? 0),
    0
  );
  const totalMacros = adjustedCarbohydrates + adjustedFat + adjustedProtein;

  useEffect(() => {
    setCaloriesLabel(
      mealItems.reduce((acc, item) => acc + (item.calories ?? 0), 0).toFixed(0)
    );
    setCarbsLabel(
      toSignificantFigures(
        mealItems.reduce((acc, item) => acc + (item.carbohydrates ?? 0), 0)
      )
    );
    setFatLabel(
      toSignificantFigures(
        mealItems.reduce((acc, item) => acc + (item.fat ?? 0), 0)
      )
    );
    setProteinLabel(
      toSignificantFigures(
        mealItems.reduce((acc, item) => acc + (item.protein ?? 0), 0)
      )
    );
  }, [mealItems]);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <ImagePickerPressable
          setImageUri={setImageUri}
          setImage={setUploadedImage}
        >
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../../assets/images/meal placeholder image.png")
            }
            className="w-full h-60"
          />
          <View className="flex-row items-center justify-between absolute bottom-4 right-4">
            <EditIcon height={25} width={25} fill="white" />
          </View>
        </ImagePickerPressable>
        <View className="px-4">
          <View className="flex-col gap-2 mt-4">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Meal Name
            </Text>
            <TextInput
              placeholder="Name Your Meal"
              placeholderTextColor="#828282"
              className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
              value={mealName}
              onChangeText={setMealName}
            />
          </View>
        </View>

        <View className="flex-row items-center justify-between px-4 mt-6 mb-4">
          <ProgressRing
            size={100}
            strokeWidth={6}
            valueLabel={caloriesLabel}
            subtitle="cal"
            macrosFull={true}
            carbs={Number(carbsLabel)}
            fat={Number(fatLabel)}
            protein={Number(proteinLabel)}
          />
          <View className="flex-row gap-12 items-center">
            <View className="flex-col justify-center items-center">
              <Text className="text-carbs font-[HelveticaNeue]">
                {toSignificantFigures(
                  (adjustedCarbohydrates / totalMacros) * 100
                )}
                %
              </Text>
              <Text className="text-white text-xl font-[HelveticaNeue] font-bold">
                {carbsLabel}g
              </Text>
              <Text className="text-white font-[HelveticaNeue]">Carbs</Text>
            </View>
            <View className="flex-col justify-center items-center">
              <Text className="text-fat font-[HelveticaNeue]">
                {toSignificantFigures((adjustedFat / totalMacros) * 100)}%
              </Text>
              <Text className="text-white text-xl font-[HelveticaNeue] font-bold">
                {fatLabel}g
              </Text>
              <Text className="text-white font-[HelveticaNeue]">Fat</Text>
            </View>
            <View className="flex-col justify-center items-center">
              <Text className="text-protein font-[HelveticaNeue]">
                {toSignificantFigures((adjustedProtein / totalMacros) * 100)}%
              </Text>
              <Text className="text-white text-xl font-[HelveticaNeue] font-bold">
                {proteinLabel}g
              </Text>
              <Text className="text-white font-[HelveticaNeue]">Protein</Text>
            </View>
          </View>
        </View>
        <Separator className="h-[0.4px] mt-6" />
        <View className="px-4">
          <View className="flex-row justify-between items-center my-3 h-12">
            <Text className="text-white text-xl font-[HelveticaNeue] font-bold">
              Meal Items
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push("/(app)/(nutrition)/logFoodSearch?searchType=meal")
              }
            >
              <Text className="text-primary text-lg font-[HelveticaNeue]">
                Add Food
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Separator className="h-[0.4px]" />
        {mealItems.map((item, index) => (
          <View
            key={index}
            className="flex-row justify-between items-center px-4 my-3"
          >
            <View>
              <Text className="text-white text-lg font-[HelveticaNeue]">
                {item.foodName.length > 28
                  ? item.foodName.substring(0, 25) + "..."
                  : item.foodName}
              </Text>
              <Text className="text-gray3 font-[HelveticaNeue]">
                {item.servingUnit}{" "}
                {item.servingsAmount ? `(${item.servingsAmount} servings)` : ""}
              </Text>
            </View>
            <View className="flex-col items-end gap-2">
              <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
                {item.calories?.toFixed(0) ?? 0} cal
              </Text>
            </View>
          </View>
        ))}
        <Separator
          className={`h-[0.4px] ${mealItems.length > 0 ? "mt-6" : ""}`}
        />
        <Text className="text-white text-lg font-[HelveticaNeue] font-bold my-6 px-4">
          Nutrition Facts
        </Text>
        <Separator className="h-[0.4px] mb-5" />
        <View className="flex-col gap-10 w-full px-4">
          <View className="flex-row justify-between gap-2 w-full">
            <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
              Calories
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
              {mealItems
                .reduce((acc, item) => acc + (item.calories ?? 0), 0)
                .toFixed(0)}
            </Text>
          </View>
          <View className="flex-col gap-2 w-full">
            <View className="flex-row justify-between gap-2 w-full">
              <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
                Total Fat
              </Text>
              <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
                {toSignificantFigures(
                  mealItems.reduce((acc, item) => acc + (item.fat ?? 0), 0)
                )}
                g
              </Text>
            </View>

            <View className="gap-4">
              <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">
                  Saturated
                </Text>
                <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">
                  {mealItems.reduce(
                    (acc, item) => acc + (item.saturatedFat ?? 0),
                    0
                  )
                    ? `${toSignificantFigures(
                        mealItems.reduce(
                          (acc, item) => acc + (item.saturatedFat ?? 0),
                          0
                        )
                      )}g`
                    : "-"}
                </Text>
              </View>
              <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">
                  Trans
                </Text>
                <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">
                  {mealItems.reduce(
                    (acc, item) => acc + (item.transFat ?? 0),
                    0
                  )
                    ? `${toSignificantFigures(
                        mealItems.reduce(
                          (acc, item) => acc + (item.transFat ?? 0),
                          0
                        )
                      )}g`
                    : "-"}
                </Text>
              </View>
              <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">
                  Polyunsaturated
                </Text>
                <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">
                  {mealItems.reduce(
                    (acc, item) => acc + (item.polyunsaturatedFat ?? 0),
                    0
                  )
                    ? `${toSignificantFigures(
                        mealItems.reduce(
                          (acc, item) => acc + (item.polyunsaturatedFat ?? 0),
                          0
                        )
                      )}g`
                    : "-"}
                </Text>
              </View>
              <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">
                  Monounsaturated
                </Text>
                <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">
                  {mealItems.reduce(
                    (acc, item) => acc + (item.monounsaturatedFat ?? 0),
                    0
                  )
                    ? `${toSignificantFigures(
                        mealItems.reduce(
                          (acc, item) => acc + (item.monounsaturatedFat ?? 0),
                          0
                        )
                      )}g`
                    : "-"}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row justify-between gap-2 w-full">
            <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
              Cholesterol
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
              {mealItems.reduce((acc, item) => acc + (item.cholesterol ?? 0), 0)
                ? `${mealItems
                    .reduce((acc, item) => acc + (item.cholesterol ?? 0), 0)
                    .toFixed(0)}mg`
                : "0mg"}
            </Text>
          </View>
          <View className="flex-row justify-between gap-2 w-full">
            <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
              Sodium
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
              {mealItems.reduce((acc, item) => acc + (item.sodium ?? 0), 0)
                ? `${mealItems
                    .reduce((acc, item) => acc + (item.sodium ?? 0), 0)
                    .toFixed(0)}mg`
                : "0mg"}
            </Text>
          </View>
          <View className="flex-col gap-2 w-full">
            <View className="flex-row justify-between gap-2 w-full">
              <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
                Total Carbohydrates
              </Text>
              <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
                {toSignificantFigures(
                  mealItems.reduce(
                    (acc, item) => acc + (item.carbohydrates ?? 0),
                    0
                  )
                )}
                g
              </Text>
            </View>

            <View className="gap-4">
              <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">
                  Dietary Fiber
                </Text>
                <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">
                  {mealItems.reduce((acc, item) => acc + (item.fiber ?? 0), 0)
                    ? `${toSignificantFigures(
                        mealItems.reduce(
                          (acc, item) => acc + (item.fiber ?? 0),
                          0
                        )
                      )}g`
                    : "-"}
                </Text>
              </View>
              <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">
                  Sugar
                </Text>
                <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">
                  {mealItems.reduce((acc, item) => acc + (item.sugar ?? 0), 0)
                    ? `${toSignificantFigures(
                        mealItems.reduce(
                          (acc, item) => acc + (item.sugar ?? 0),
                          0
                        )
                      )}g`
                    : "-"}
                </Text>
              </View>
              <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">
                  Added Sugars
                </Text>
                <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">
                  {"N/A"}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row justify-between gap-2 w-full mb-32">
            <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
              Protein
            </Text>
            <Text className="text-white text-lg font-[HelveticaNeue] font-medium">
              {toSignificantFigures(
                mealItems.reduce((acc, item) => acc + (item.protein ?? 0), 0)
              )}
              g
            </Text>
          </View>
        </View>
      </ScrollView>
      <GenericButton
        text="Create Meal"
        onPress={async () => {
          if (!mealName.trim()) {
            console.log("Meal name is required");
            return;
          }

          const requestData = {
            mealName: mealName,
            mealImageFileName: uploadedImage?.fileName || null,
            mealImageBase64: uploadedImage?.base64 || null,
            mealImageMimeType: uploadedImage?.mimeType || null,
            foodItems: mealItems,
          };

          const response = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/meals/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await SecureStore.getItemAsync(
                  "jwtToken"
                )}`,
              },
              body: JSON.stringify(requestData),
            }
          );

          if (response?.ok) {
            console.log("Meal created successfully");
            router.back();
          } else {
            console.log("Meal creation failed");
          }
        }}
        className="self-center absolute bottom-20"
        textClassName="text-lg"
      />
    </SafeAreaView>
  );
};
export default CreateMeal;
