import { Text, Pressable, View, Image } from "react-native";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const FoodSearchItem = ({
  foodName,
  foodImgUrl,
  calories,
  brandName,
  servingSize,
  servingSizeUnit,
  onPress,
}: {
  foodName: string;
  foodImgUrl?: string | number;
  calories: number;
  brandName?: string;
  servingSize: number;
  servingSizeUnit: string;
  onPress: () => void;
}) => {
  const { user } = useContext(UserContext);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between bg-gray1 rounded-xl p-4 mb-3"
    >
      <View className={`flex-1 ${foodImgUrl ? "flex-row gap-3" : ""}`}>
        {foodImgUrl && (
          <Image
            source={
              typeof foodImgUrl === "string" ? { uri: foodImgUrl } : foodImgUrl
            }
            className="w-16 h-16 rounded-lg"
          />
        )}
        <View className="justify-center">
          <Text className="text-white text-base font-[HelveticaNeue] mb-1">
            {foodName}
          </Text>
          <Text className="text-gray3 text-sm font-[HelveticaNeue]">
            {calories} {user?.weightType === "KGS" ? "kcal" : "cal"},{" "}
            {brandName ? brandName + ", " : ""}
            {servingSize && servingSizeUnit
              ? `${servingSize} ${servingSizeUnit}`
              : servingSize || servingSizeUnit}
          </Text>
        </View>
      </View>
      <Pressable className="w-10 h-10 bg-gray2 rounded-full items-center justify-center">
        <Text className="text-red-500 text-2xl text-center">+</Text>
      </Pressable>
    </Pressable>
  );
};
export default FoodSearchItem;
