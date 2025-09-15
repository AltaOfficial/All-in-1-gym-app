import { Text, TextInput, View } from "react-native";
import { useContext } from "react";
import { RecipeContext } from "../../../../context/RecipeContext";

const CreateRecipeInfo = () => {
  const { setRecipeName, setServingsAmount, recipeName, servingsAmount } =
    useContext(RecipeContext);

  return (
    <View className="flex-1">
      <View className="px-4">
        <View className="flex-col gap-2 mt-4">
          <Text className="text-white text-lg font-[HelveticaNeue]">
            Recipe Name
          </Text>
          <TextInput
            value={recipeName}
            onChangeText={(text) => setRecipeName(text)}
            placeholder="ex. Chicken Soup"
            placeholderTextColor="#828282"
            className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
          />
        </View>
        <View className="flex-col gap-2 mt-4">
          <Text className="text-white text-lg font-[HelveticaNeue]">
            Servings Amount
          </Text>
          <View className="flex-row gap-4 justify-between w-full">
            <TextInput
              value={servingsAmount}
              onChangeText={(text) => setServingsAmount(text)}
              placeholder="1"
              keyboardType="numeric"
              placeholderTextColor="#828282"
              className="text-white text-lg h-[3.7rem] w-44 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default CreateRecipeInfo;
