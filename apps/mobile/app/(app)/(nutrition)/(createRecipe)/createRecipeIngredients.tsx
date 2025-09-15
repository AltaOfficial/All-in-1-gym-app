import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GenericButton from "../../../../components/GenericButton";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { FoodType } from "../../../../types/foodType";
import { useContext } from "react";
import { RecipeContext } from "../../../../context/RecipeContext";
import Separator from "../../../../components/Separator";

const CreateRecipeIngredients = () => {
  const { ingredients, servingsAmount, clearRecipeContext, recipeName } =
    useContext(RecipeContext);

  const handleCreateRecipe = async () => {
    // Validate required fields
    if (ingredients.length === 0) {
      console.log("Ingredients are required");
      console.error("Ingredients are required");
      return;
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/recipes/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await SecureStore.getItemAsync("jwtToken")}`,
        },
        body: JSON.stringify({
          recipeName: recipeName,
          servingsAmount: servingsAmount,
          ingredients: ingredients,
        }),
      }
    );

    if (response.ok) {
      const createdRecipe = await response.json();
      console.log("Recipe created successfully:", createdRecipe);
      clearRecipeContext(); // Clear the context after successful creation
      router.back(); // Go back to previous screens
      router.back();
    } else {
      const errorText = await response.text();
      console.error("Error creating recipe:", response.status, errorText);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      {ingredients.length > 0 && (
        <View className="flex-col gap-2 px-4 pb-8">
          <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
            {servingsAmount} servings
          </Text>
          <Text className="text-white text-lg font-[HelveticaNeue]">
            {(
              ingredients.reduce(
                (acc, ingredient) => acc + (ingredient.calories ?? 0),
                0
              ) / Number(servingsAmount)
            ).toFixed(0)}{" "}
            cal / serving
          </Text>
        </View>
      )}
      <ScrollView className="flex-1">
        {ingredients.length == 0 && (
          <View className="px-4 pb-28 pt-10 justify-center items-center">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              No ingredients added
            </Text>
          </View>
        )}
        {ingredients.length > 0 &&
          ingredients.map((ingredient: FoodType, index: number) => (
            <View key={index} className="px-4">
              <Separator className="h-[0.4px]" />
              <View className="py-1">
                <View className="flex-row justify-between items-center px-2 my-2">
                  <View>
                    <Text className="text-white text-lg font-[HelveticaNeue]">
                      {ingredient.foodName.length > 28
                        ? ingredient.foodName.substring(0, 25) + "..."
                        : ingredient.foodName}
                    </Text>
                    <Text className="text-gray3 font-[HelveticaNeue]">
                      {ingredient.servingsAmount
                        ? `(${ingredient.servingsAmount} servings)`
                        : ""}
                    </Text>
                  </View>
                  <View className="flex-col items-end gap-2">
                    <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
                      {ingredient.calories?.toFixed(0) ?? 0} cal
                    </Text>
                  </View>
                </View>
              </View>
              <Separator className="h-[0.4px]" />
            </View>
          ))}
      </ScrollView>
      <GenericButton
        text="Create Recipe"
        onPress={handleCreateRecipe}
        className="self-center absolute bottom-20"
        textClassName="text-lg"
      />
    </SafeAreaView>
  );
};
export default CreateRecipeIngredients;
