import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import GenericButton from '../../../../components/GenericButton';
import { useState } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { FoodType } from '../../../../types/foodType';
import { useContext } from 'react';
import { CreateFoodContext } from '../../../../context/CreateFoodContext';

const CreateFoodNutrients = () => {
  const { 
    brandName, 
    description, 
    servingSize, 
    servingUnit,
    clearContext 
  } = useContext(CreateFoodContext);
  
  // State for nutrient values
  const [calories, setCalories] = useState('');
  const [totalFat, setTotalFat] = useState('');
  const [saturatedFat, setSaturatedFat] = useState('');
  const [transFat, setTransFat] = useState('');
  const [polyunsaturatedFat, setPolyunsaturatedFat] = useState('');
  const [monounsaturatedFat, setMonounsaturatedFat] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [sodium, setSodium] = useState('');
  const [totalCarbohydrates, setTotalCarbohydrates] = useState('');
  const [dietaryFiber, setDietaryFiber] = useState('');
  const [totalSugars, setTotalSugars] = useState('');
  const [protein, setProtein] = useState('');
  const [potassium, setPotassium] = useState('');

  const handleCreateFood = async () => {
    // Validate required fields
    if (!calories.trim() || !description.trim() || !servingSize.trim() || !servingUnit.trim()) {
        console.log("Calories, description, and servingSize are required", calories, description, servingSize, servingUnit);
      console.error("Calories, description, and servingSize are required");
      return;
    }

      // Create the food using FoodType interface
      const foodData: FoodType = {
        foodName: description,
        foodBrandName: brandName,
        servingSize: parseFloat(servingSize),
        servingUnit: servingUnit,
        calories: parseFloat(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbohydrates: parseFloat(totalCarbohydrates) || 0,
        fat: parseFloat(totalFat) || 0,
        fiber: parseFloat(dietaryFiber) || 0,
        sugar: parseFloat(totalSugars) || 0,
        saturatedFat: parseFloat(saturatedFat) || 0,
        polyunsaturatedFat: parseFloat(polyunsaturatedFat) || 0,
        monounsaturatedFat: parseFloat(monounsaturatedFat) || 0,
        transFat: parseFloat(transFat) || 0,
        cholesterol: parseFloat(cholesterol) || 0,
        sodium: parseFloat(sodium) || 0,
        potassium: parseFloat(potassium) || 0
      };

      console.log('Creating food with data:', foodData);

      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/foods/createfood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`,
        },
        body: JSON.stringify(foodData),
      });

      if (response.ok) {
        const createdFood = await response.json();
        console.log('Food created successfully:', createdFood);
        clearContext(); // Clear the context after successful creation
        router.back(); // Go back to previous screens
        router.back();
      } else {
        const errorText = await response.text();
        console.error('Error creating food:', response.status, errorText);
      }
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
        <ScrollView className="flex-1">
            <View className="px-4 pb-28">
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Calories</Text>
                    <TextInput 
                        value={calories}
                        onChangeText={(text) => setCalories(text)} 
                        placeholder="Required" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Protein (g)</Text>
                    <TextInput 
                        value={protein}
                        onChangeText={(text) => setProtein(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Total Fat (g)</Text>
                    <TextInput 
                        value={totalFat}
                        onChangeText={(text) => setTotalFat(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Saturated Fat (g)</Text>
                    <TextInput 
                        value={saturatedFat}
                        onChangeText={(text) => setSaturatedFat(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Trans Fat (g)</Text>
                    <TextInput 
                        value={transFat}
                        onChangeText={(text) => setTransFat(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Polyunsaturated Fat (g)</Text>
                    <TextInput 
                        value={polyunsaturatedFat}
                        onChangeText={(text) => setPolyunsaturatedFat(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Monounsaturated Fat (g)</Text>
                    <TextInput 
                        value={monounsaturatedFat}
                        onChangeText={(text) => setMonounsaturatedFat(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Cholesterol (mg)</Text>
                    <TextInput 
                        value={cholesterol}
                        onChangeText={(text) => setCholesterol(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Sodium (mg)</Text>
                    <TextInput 
                        value={sodium}
                        onChangeText={(text) => setSodium(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Potassium (mg)</Text>
                    <TextInput 
                        value={potassium}
                        onChangeText={(text) => setPotassium(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Total Carbohydrates (g)</Text>
                    <TextInput 
                        value={totalCarbohydrates}
                        onChangeText={(text) => setTotalCarbohydrates(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Dietary Fiber (g)</Text>
                    <TextInput 
                        value={dietaryFiber}
                        onChangeText={(text) => setDietaryFiber(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Total Sugars (g)</Text>
                    <TextInput 
                        value={totalSugars}
                        onChangeText={(text) => setTotalSugars(text)} 
                        placeholder="Optional" 
                        keyboardType="numeric"
                        placeholderTextColor="#828282" 
                        className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" 
                    />
                </View>
            </View>
        </ScrollView>
        <GenericButton text="Create Food" onPress={handleCreateFood} className="self-center absolute bottom-20" textClassName="text-lg" />
    </SafeAreaView>
  )
}
export default CreateFoodNutrients
const styles = StyleSheet.create({})