import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import SearchIcon from '../../../assets/icons/SearchIcon'
import { useState } from 'react';
import BarcodeIcon from '../../../assets/icons/BarcodeIcon';
import FoodSearchItem from '../../../components/FoodSearchItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { FoodSearchResult } from '../../../types/searchResultType';
import MealIcon from '../../../assets/icons/MealIcon';
import ChickenWingIcon from '../../../assets/icons/ChickenWingIcon';

export default function LogFoodSearch() {
    const [selectedTab, setSelectedTab] = useState('all');
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1">
      <View className="bg-gray1 px-10">
        <View className="flex-row items-center gap-4 px-6 border border-white rounded-full"> 
            <SearchIcon height={20} width={20} fill="#828282" />
            <TextInput
            placeholder={selectedTab === 'all' ? "Search foods" : selectedTab === 'myMeals' ? "Search My Meals" : "Search My Foods"}
            placeholderTextColor="#828282"
            className="text-white font-[HelveticaNeue] w-full"
            returnKeyType='search'
            onChangeText={(text) => {
                if(text.length == 0) {
                    setSearchResults([]);
                    setNoResults(false);
                }
            }}
            onSubmitEditing={async (e) => {
                const searchQuery = encodeURIComponent(e.nativeEvent.text);
                const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/foods/search?query=${searchQuery}`, {
                    headers: {
                        'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`
                    }
                });
                const data = await response.json();
                setSearchResults(data);
                if(data.length == 0) {
                    setNoResults(true);
                }
            }}
            />
        </View>
        <View className="flex-row items-center justify-evenly px-6 gap-14 mt-4">
            <Pressable onPress={() => setSelectedTab('all')}>
                <Text className={`text-white text-md font-[HelveticaNeue] pb-4 border-b-2 border-gray1 ${selectedTab === 'all' ? '!border-primary' : ''}`}>
                    {"   All   "}
                </Text>
            </Pressable>

            <Pressable onPress={() => setSelectedTab('myMeals')}>
                <Text className={`text-white text-md font-[HelveticaNeue] pb-4 border-b-2 border-gray1 ${selectedTab === 'myMeals' ? '!border-primary' : ''}`}>
                    {"My Meals"}
                </Text>
            </Pressable>
            
            <Pressable onPress={() => setSelectedTab('myFoods')}>
                <Text className={`text-white text-md font-[HelveticaNeue] pb-4 border-b-2 border-gray1 ${selectedTab === 'myFoods' ? '!border-primary' : ''}`}>
                    {"My Foods"}
                </Text>
            </Pressable>
        </View>
      </View>

     {(searchResults.length == 0  && !noResults) && <ScrollView className="flex-1">
            <Pressable className="px-6 mt-8" onPress={() => router.push(selectedTab === 'all' ? '/(app)/(nutrition)/scanBarcode' : selectedTab === 'myMeals' ? '/createMeal' : '/(createFood)/createFoodBasic')}>
                <View className="flex-row items-center gap-6 bg-gray1 rounded-xl py-3 px-4 h-28">
                    {selectedTab === 'all' ? <BarcodeIcon height={80} width={80} fill="white" /> : selectedTab === 'myMeals' ? <MealIcon height={80} width={80} fill="white" /> : <ChickenWingIcon height={80} width={80} fill="white" />}
                    <View>
                        <Text className="text-white text-2xl font-[HelveticaNeue]">{selectedTab === 'all' ? "Scan Barcode" : selectedTab === 'myMeals' ? "Create New Meal" : "Create New Food"}</Text>
                        <Text className="text-white text-xs font-[HelveticaNeue]">{selectedTab === 'all' ? "Find your food instantly by scanning \nthe barcode on it" : selectedTab === 'myMeals' ? "Create a new meal by\nadding foods to it" : "Create a new food by\nadding nutrient details"}</Text>
                    </View>
                </View>
            </Pressable>

            <ScrollView className="px-6 mt-16">
                <Text className="text-white font-[HelveticaNeue] mb-4">Recent Foods</Text>
                <ScrollView>
                    <FoodSearchItem foodName="Frootloops, cereal" calories={153} brandName="Kellogg's" servingSize={0.5} servingSizeUnit="cup" onPress={() => {}} />
                    <FoodSearchItem foodName="Banana" calories={89} brandName="Fresh" servingSize={1} servingSizeUnit="medium" onPress={() => {}} />
                    <FoodSearchItem foodName="Chicken breast" calories={165} brandName="Organic" servingSize={100} servingSizeUnit="g" onPress={() => {}} />
                    <FoodSearchItem foodName="Greek yogurt" calories={130} brandName="Chobani" servingSize={170} servingSizeUnit="g" onPress={() => {}} />
                    <FoodSearchItem foodName="Greek yogurt" calories={130} brandName="Chobani" servingSize={170} servingSizeUnit="g" onPress={() => {}} />
                    <FoodSearchItem foodName="Greek yogurt" calories={130} brandName="Chobani" servingSize={170} servingSizeUnit="g" onPress={() => {}} />
                    <FoodSearchItem foodName="Greek yogurt" calories={130} brandName="Chobani" servingSize={170} servingSizeUnit="g" onPress={() => {}} />
                </ScrollView>
            </ScrollView>
        </ScrollView>} 
        {searchResults.length > 0 && !noResults && <ScrollView className="flex-1 px-2 pt-8">
            {searchResults.map((result: FoodSearchResult, index) => (
                <FoodSearchItem 
                    key={index} 
                    foodName={result.foodName || 'Unknown Food'} 
                    calories={Number((result.servingSize && result.servingUnit) ? calculateCalories(result.servingSize, normalizeUnit(result.servingUnit), result.calories).toFixed(2) : (result.calories || 0).toFixed(2))}
                    brandName={result.foodBrandName || result.foodBrandOwner || ''}
                    servingSize={Number(result.householdServingText && !(result.householdServingText.length > 20) ? "" : (result.servingSize || 1))}
                    servingSizeUnit={normalizeUnit(result.householdServingText && !(result.householdServingText.length > 20) ? result.householdServingText : result.servingUnit)}
                    onPress={() => {
                        router.push({
                        pathname: "/(app)/(nutrition)/logFood",
                        params: {
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
                            potassium: result.potassium
                            
                        }
                    })}} 
                />
            ))}
        </ScrollView>}
        {noResults && <View className="flex-1 px-2 mt-8">
            <Text className="text-white font-[HelveticaNeue] text-center text-xl">{"No results found :("}</Text>
        </View>}
    </SafeAreaView>
  )
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
  
  function calculateCalories(servingSize: number, servingSizeUnit: string, caloriesPerGram: number) {
    const grams = toGrams(servingSize, servingSizeUnit);
    return grams * caloriesPerGram;
  }