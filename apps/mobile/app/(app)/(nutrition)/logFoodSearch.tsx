import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import SearchIcon from "../../../assets/icons/SearchIcon";
import { useState, useEffect, useContext } from "react";
import BarcodeIcon from "../../../assets/icons/BarcodeIcon";
import FoodSearchItem from "../../../components/FoodSearchItem";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { FoodSearchResult } from "../../../types/searchResultType";
import { FoodType } from "../../../types/foodType";
import { MealType } from "../../../types/mealType";
import MealIcon from "../../../assets/icons/MealIcon";
import ChickenWingIcon from "../../../assets/icons/ChickenWingIcon";
import { getRecentFoods } from "../../../services/getRecentFoods";
import { getUserFoods } from "../../../services/getUserFoods";
import CookingPotIcon from "../../../assets/icons/CookingPotIcon";
import { getUserRecipes } from "../../../services/getUserRecipes";
import { RecipeType } from "../../../types/recipeType";
import { RecipeContext } from "../../../context/RecipeContext";
import { MealContext } from "../../../context/MealContext";
import { useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { getUserMeals } from "../../../services/getUserMeals";

export default function LogFoodSearch() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [recentFoods, setRecentFoods] = useState<FoodType[]>([]);
  const [userFoods, setUserFoods] = useState<FoodType[]>([]);
  const [userRecipes, setUserRecipes] = useState<RecipeType[]>([]);
  const [userMeals, setUserMeals] = useState<MealType[]>([]);
  const { clearRecipeContext } = useContext(RecipeContext);
  const { clearMealContext } = useContext(MealContext);
  const { searchType, mealType, date } = useLocalSearchParams();
  const isFocused = useIsFocused();

  // Fetch data based on selected tab
  useEffect(() => {
    const fetchData = async () => {
      switch (selectedTab) {
        case "all":
          setRecentFoods(await getRecentFoods());
          break;
        case "myFoods":
          setUserFoods(await getUserFoods());
          break;
        case "myRecipes":
          setUserRecipes(await getUserRecipes());
          break;
        case "myMeals":
          setUserMeals(await getUserMeals());
          break;
      }
    };

    fetchData();
  }, [selectedTab, isFocused]);

  // Get the appropriate food list based on selected tab
  const displayFoods =
    selectedTab === "all"
      ? recentFoods
      : selectedTab === "myFoods"
      ? userFoods
      : selectedTab === "myRecipes"
      ? userRecipes
      : selectedTab === "myMeals"
      ? userMeals
      : [];

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      <View className="bg-gray1 px-10">
        <View className="flex-row items-center gap-4 px-6 border border-white rounded-full">
          <SearchIcon height={20} width={20} fill="#828282" />
          <TextInput
            placeholder={"Search For Foods"}
            placeholderTextColor="#828282"
            className="text-white font-[HelveticaNeue] w-full"
            returnKeyType="search"
            onChangeText={async (text) => {
              let searchText = text.trim().toLocaleLowerCase();
              switch (selectedTab) {
                case "all":
                  setRecentFoods(recentFoods.filter((food) => food.foodName.toLocaleLowerCase().includes(searchText)));
                  break;
                case "myFoods":
                  setUserFoods(userFoods.filter((food) => food.foodName.toLocaleLowerCase().includes(searchText)));
                  break;
                case"myRecipes":
                  setUserRecipes(userRecipes.filter((recipe) => recipe.recipeName.toLocaleLowerCase().includes(searchText)));
                  break;
                case "myMeals":
                  setUserMeals(userMeals.filter((meal) => meal.mealName.toLocaleLowerCase().includes(searchText)));
                  break;
              }
              if (text.length == 0) {
                setSearchResults([]);
                setNoResults(false);
              }
            }}
            onSubmitEditing={async (e) => {
              const searchQuery = encodeURIComponent(e.nativeEvent.text);
              const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/foods/search?query=${searchQuery}`,
                {
                  headers: {
                    Authorization: `Bearer ${await SecureStore.getItemAsync(
                      "jwtToken"
                    )}`,
                  },
                }
              );
              const data = await response.json();
              setSearchResults(data);
              if (data.length == 0) {
                setNoResults(true);
              }
            }}
          />
        </View>
        <View className="flex-row items-center justify-center px-6 mt-4 gap-6">
          <Pressable onPress={() => setSelectedTab("all")}>
            <Text
              className={`text-white text-md font-[HelveticaNeue] pb-4 border-b-2 border-gray1 ${
                selectedTab === "all" ? "!border-primary" : ""
              }`}
            >
              {"   All   "}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (searchType !== "meal" && searchType !== "recipe") {
                setSelectedTab("myMeals");
              }
            }}
          >
            <Text
              className={`text-white text-md font-[HelveticaNeue] pb-4 border-b-2 border-gray1 ${
                selectedTab === "myMeals" ? "!border-primary" : ""
              }`}
            >
              {"My Meals"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (searchType !== "meal" && searchType !== "recipe") {
                setSelectedTab("myRecipes");
              }
            }}
          >
            <Text
              className={`text-white text-md font-[HelveticaNeue] pb-4 border-b-2 border-gray1 ${
                selectedTab === "myRecipes" ? "!border-primary" : ""
              }`}
            >
              {"My Recipes"}
            </Text>
          </Pressable>

          <Pressable onPress={() => setSelectedTab("myFoods")}>
            <Text
              className={`text-white text-md font-[HelveticaNeue] pb-4 border-b-2 border-gray1 ${
                selectedTab === "myFoods" ? "!border-primary" : ""
              }`}
            >
              {"My Foods"}
            </Text>
          </Pressable>
        </View>
      </View>

      {searchResults.length == 0 && !noResults && (
        <ScrollView className="flex-1">
          {((selectedTab !== "myFoods" &&
            (searchType == "recipe" || searchType == "meal")) ||
            searchType == undefined ||
            (searchType == "mealPlan" && selectedTab === "all")) && (
            <Pressable
              className="px-6 mt-8"
              onPress={() => {
                if (selectedTab == "myRecipes") {
                  clearRecipeContext();
                }
                if (selectedTab == "myMeals") {
                  clearMealContext();
                }
                router.push(
                  selectedTab === "all"
                    ? "/(app)/(nutrition)/scanBarcode?searchType=" +
                        searchType +
                        "&mealType=" +
                        mealType +
                        "&date=" +
                        date
                    : selectedTab === "myMeals"
                    ? "/createMeal"
                    : selectedTab === "myRecipes"
                    ? "/(createRecipe)/createRecipeInfo"
                    : "/(createFood)/createFoodBasic"
                );
              }}
            >
              <View className="flex-row items-center gap-6 bg-gray1 rounded-xl py-3 px-4 h-28">
                {selectedTab === "all" ? (
                  <BarcodeIcon height={80} width={80} fill="white" />
                ) : selectedTab === "myMeals" ? (
                  <MealIcon height={80} width={80} fill="white" />
                ) : selectedTab === "myRecipes" ? (
                  <CookingPotIcon height={80} width={80} fill="white" />
                ) : (
                  <ChickenWingIcon height={80} width={80} fill="white" />
                )}
                <View>
                  <Text className="text-white text-2xl font-[HelveticaNeue]">
                    {selectedTab === "all"
                      ? "Scan Barcode"
                      : selectedTab === "myMeals"
                      ? "Create New Meal"
                      : selectedTab === "myRecipes"
                      ? "Create New Recipe"
                      : "Create New Food"}
                  </Text>
                  <Text className="text-white text-xs font-[HelveticaNeue]">
                    {selectedTab === "all"
                      ? "Find your food instantly by scanning \nthe barcode on it"
                      : selectedTab === "myMeals"
                      ? "Create a new meal by\nadding foods to it"
                      : selectedTab === "myRecipes"
                      ? "Create a new recipe by\nadding ingredients to it"
                      : "Create a new food by\nadding nutrient details"}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          <ScrollView className="px-6 mt-16">
            <Text className="text-white font-[HelveticaNeue] mb-4">
              {selectedTab === "all"
                ? "Recent Foods"
                : selectedTab === "myFoods"
                ? "My Foods"
                : selectedTab === "myRecipes"
                ? "My Recipes"
                : "My Meals"}
            </Text>
            <ScrollView>
              {displayFoods.length > 0 ? (
                displayFoods.map((food, index) => {
                  if (selectedTab === "all") {
                    const recentFood = food as FoodType;
                    return (
                      <FoodSearchItem
                        key={index}
                        foodName={recentFood.foodName || "Unknown Food"}
                        calories={parseFloat(
                          recentFood.calories?.toFixed(2) || "0"
                        )}
                        brandName={recentFood.foodBrandName || ""}
                        servingSize={recentFood.servingSize || 1}
                        servingSizeUnit="g"
                        onPress={() => {
                          router.push({
                            pathname: "/(app)/(nutrition)/logFood",
                            params: {
                              addType: searchType,
                              mealType: mealType,
                              date: date,
                              foodName: recentFood.foodName,
                              brandName: recentFood.foodBrandName,
                              servingSize: recentFood.servingSize || 1,
                              servingSizeUnit: "g",
                              calories: recentFood.calories,
                              protein: recentFood.protein,
                              carbohydrates: recentFood.carbohydrates,
                              fat: recentFood.fat,
                              fiber: 0,
                              sugar: 0,
                              saturatedFat: 0,
                              polyunsaturatedFat: 0,
                              monounsaturatedFat: 0,
                              transFat: 0,
                              cholesterol: 0,
                              sodium: 0,
                              potassium: 0,
                            },
                          });
                        }}
                      />
                    );
                  } else if (selectedTab === "myMeals") {
                    const userMeal = food as MealType;
                    return (
                      <FoodSearchItem
                        key={index}
                        foodName={userMeal.mealName || "Unknown Meal"}
                        foodImgUrl={
                          userMeal.mealImageUrl ||
                          require("../../../assets/images/meal placeholder image.png")
                        }
                        calories={Number(
                          userMeal.foodItems
                            .reduce(
                              (acc, foodItem) => acc + (foodItem.calories || 0),
                              0
                            )
                            .toFixed(2)
                        )}
                        servingSize={1}
                        servingSizeUnit={"serving"}
                        onPress={() =>
                          router.push({
                            pathname: "/(app)/(nutrition)/logFood",
                            params: {
                              addType: searchType ? searchType : "logMeal",
                              mealType: mealType,
                              date: date,
                              foodImageUrl: userMeal.mealImageUrl,
                              foodName: userMeal.mealName,
                              userId: userMeal.userid,
                              brandName: "",
                              calories: userMeal.foodItems.reduce(
                                (acc, foodItem) =>
                                  acc + (foodItem.calories || 0),
                                0
                              ),
                              protein: userMeal.foodItems.reduce(
                                (acc, foodItem) =>
                                  acc + (foodItem.protein || 0),
                                0
                              ),
                              carbohydrates: userMeal.foodItems.reduce(
                                (acc, foodItem) =>
                                  acc + (foodItem.carbohydrates || 0),
                                0
                              ),
                              fat: userMeal.foodItems.reduce(
                                (acc, foodItem) => acc + (foodItem.fat || 0),
                                0
                              ),
                              fiber: userMeal.foodItems.reduce(
                                (acc, foodItem) => acc + (foodItem.fiber || 0),
                                0
                              ),
                              sugar: userMeal.foodItems.reduce(
                                (acc, foodItem) => acc + (foodItem.sugar || 0),
                                0
                              ),
                              saturatedFat: userMeal.foodItems.reduce(
                                (acc, foodItem) =>
                                  acc + (foodItem.saturatedFat || 0),
                                0
                              ),
                              polyunsaturatedFat: userMeal.foodItems.reduce(
                                (acc, foodItem) =>
                                  acc + (foodItem.polyunsaturatedFat || 0),
                                0
                              ),
                              monounsaturatedFat: userMeal.foodItems.reduce(
                                (acc, foodItem) =>
                                  acc + (foodItem.monounsaturatedFat || 0),
                                0
                              ),
                              transFat: userMeal.foodItems.reduce(
                                (acc, foodItem) =>
                                  acc + (foodItem.transFat || 0),
                                0
                              ),
                              cholesterol: userMeal.foodItems.reduce(
                                (acc, foodItem) =>
                                  acc + (foodItem.cholesterol || 0),
                                0
                              ),
                              sodium: userMeal.foodItems.reduce(
                                (acc, foodItem) => acc + (foodItem.sodium || 0),
                                0
                              ),
                              potassium: userMeal.foodItems.reduce(
                                (acc, foodItem) =>
                                  acc + (foodItem.potassium || 0),
                                0
                              ),
                            },
                          })
                        }
                      />
                    );
                  } else if (selectedTab === "myRecipes") {
                    const userRecipe = food as RecipeType;
                    return (
                      <FoodSearchItem
                        key={index}
                        foodName={userRecipe.recipeName || "Unknown Recipe"}
                        calories={Number(
                          (
                            userRecipe.ingredients.reduce(
                              (acc, ingredient) =>
                                acc + (ingredient.calories || 0),
                              0
                            ) / (userRecipe.servingsAmount || 0)
                          ).toFixed(2)
                        )}
                        servingSize={1}
                        servingSizeUnit={"serving"}
                        onPress={() =>
                          router.push({
                            pathname: "/(app)/(nutrition)/logFood",
                            params: {
                              addType: searchType ? searchType : "logRecipe",
                              foodName: userRecipe.recipeName,
                              mealType: mealType,
                              date: date,
                              userId: userRecipe.userid,
                              brandName: "",
                              calories:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.calories || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              protein:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.protein || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              carbohydrates:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.carbohydrates || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              fat:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.fat || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              fiber:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.fiber || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              sugar:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.sugar || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              saturatedFat:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.saturatedFat || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              polyunsaturatedFat:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.polyunsaturatedFat || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              monounsaturatedFat:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.monounsaturatedFat || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              transFat:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.transFat || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              cholesterol:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.cholesterol || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              sodium:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.sodium || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                              potassium:
                                userRecipe.ingredients.reduce(
                                  (acc, ingredient) =>
                                    acc + (ingredient.potassium || 0),
                                  0
                                ) / (userRecipe.servingsAmount || 0),
                            },
                          })
                        }
                      />
                    );
                  } else if (selectedTab === "myFoods") {
                    const userFood = food as FoodType;
                    return (
                      <FoodSearchItem
                        key={index}
                        foodName={userFood.foodName || "Unknown Food"}
                        calories={userFood.calories || 0}
                        brandName={userFood.foodBrandName || ""}
                        servingSize={userFood.servingSize || 1}
                        servingSizeUnit={userFood.servingUnit || "g"}
                        onPress={() => {
                          router.push({
                            pathname: "/(app)/(nutrition)/logFood",
                            params: {
                              addType: searchType,
                              date: date,
                              mealType: mealType,
                              foodName: userFood.foodName,
                              userId: userFood.userCreatedById,
                              brandName: userFood.foodBrandName,
                              servingSize: userFood.servingSize,
                              servingSizeUnit: userFood.servingUnit,
                              calories: userFood.calories,
                              protein: userFood.protein,
                              carbohydrates: userFood.carbohydrates,
                              fat: userFood.fat,
                              fiber: userFood.fiber,
                              sugar: userFood.sugar,
                              saturatedFat: userFood.saturatedFat,
                              polyunsaturatedFat: userFood.polyunsaturatedFat,
                              monounsaturatedFat: userFood.monounsaturatedFat,
                              transFat: userFood.transFat,
                              cholesterol: userFood.cholesterol,
                              sodium: userFood.sodium,
                              potassium: userFood.potassium,
                            },
                          });
                        }}
                      />
                    );
                  }
                  return null;
                })
              ) : (
                <Text className="text-white text-center py-4">
                  {selectedTab === "all"
                    ? "No recent foods found"
                    : selectedTab === "myFoods"
                    ? "No foods created yet"
                    : selectedTab === "myRecipes"
                    ? "No recipes created yet"
                    : "No meals created yet"}
                </Text>
              )}
            </ScrollView>
          </ScrollView>
        </ScrollView>
      )}
      {searchResults.length > 0 && !noResults && (
        <ScrollView className="flex-1 px-2 pt-8">
          {searchResults.map((result: FoodSearchResult, index) => (
            <FoodSearchItem
              key={index}
              foodName={result.foodName || "Unknown Food"}
              calories={Number(
                result.servingSize && result.servingUnit
                  ? calculateCalories(
                      result.servingSize,
                      normalizeUnit(result.servingUnit),
                      result.calories
                    ).toFixed(2)
                  : (result.calories || 0).toFixed(2)
              )}
              brandName={result.foodBrandName || result.foodBrandOwner || ""}
              servingSize={Number(
                result.householdServingText &&
                  !(result.householdServingText.length > 20)
                  ? ""
                  : result.servingSize || 1
              )}
              servingSizeUnit={normalizeUnit(
                result.householdServingText &&
                  !(result.householdServingText.length > 20)
                  ? result.householdServingText
                  : result.servingUnit
              )}
              onPress={() => {
                router.push({
                  pathname: "/(app)/(nutrition)/logFood",
                  params: {
                    addType: searchType,
                    mealType: mealType,
                    date: date,
                    foodName: result.foodName,
                    brandName: result.foodBrandName,
                    servingSize: result.servingSize,
                    servingSizeUnit: result.servingUnit,
                    calories: result.calories,
                    protein: result.protein,
                    carbohydrates: result.carbohydrates,
                    fat: result.fat,
                    fiber: result.fiber,
                    sugar: result.sugar,
                    saturatedFat: result.saturatedFat,
                    polyunsaturatedFat: result.polyunsaturatedFat,
                    monounsaturatedFat: result.monounsaturatedFat,
                    transFat: result.transFat,
                    cholesterol: result.cholesterol,
                    sodium: result.sodium,
                    potassium: result.potassium,
                  },
                });
              }}
            />
          ))}
        </ScrollView>
      )}
      {noResults && (
        <View className="flex-1 px-2 mt-8">
          <Text className="text-white font-[HelveticaNeue] text-center text-xl">
            {"No results found :("}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function normalizeUnit(unit: string | null | undefined) {
  if (!unit) return "g"; // default to grams if unit is null/undefined

  switch (unit.toLowerCase()) {
    case "g":
    case "gr":
    case "grm":
    case "gram":
    case "grams":
      return "g";
    case "kg":
    case "kilogram":
    case "kilograms":
      return "kg";
    case "oz":
    case "ounce":
    case "ounces":
      return "oz";
    case "lb":
    case "lbs":
    case "pound":
    case "pounds":
      return "lb";
    default:
      return unit.toLowerCase();
  }
}

function toGrams(servingSize: number, unit: string) {
  switch (unit.toLowerCase()) {
    case "g":
      return servingSize;
    case "kg":
      return servingSize * 1000;
    case "mg":
      return servingSize / 1000;
    case "mcg":
      return servingSize / 1_000_000;
    case "lb":
      return servingSize * 453.592;
    case "oz":
      return servingSize * 28.3495;
    case "ml":
      return servingSize; // assumes 1ml ≈ 1g (only true for water-like foods)
    case "cup":
      return servingSize * 240; // rough average, can vary by food
    default:
      return servingSize; // fallback, assume it's grams
  }
}

function calculateCalories(
  servingSize: number,
  servingSizeUnit: string,
  caloriesPerGram: number
) {
  const grams = toGrams(servingSize, servingSizeUnit);
  return grams * caloriesPerGram;
}
