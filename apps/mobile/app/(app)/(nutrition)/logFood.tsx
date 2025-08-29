import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import Separator from '../../../components/Separator';
import ProgressRing from '../../../components/ProgressRing';
import GenericButton from '../../../components/GenericButton';
import { useContext } from 'react';
import { MetricsContext } from '../../../context/MetricsContext';

export default function LogFood() {
    const { refreshMetrics } = useContext(MetricsContext);

    const { foodName, calories, protein, carbohydrates, fat, fiber, sugar, saturatedFat, polyunsaturatedFat, monounsaturatedFat, transFat, cholesterol, sodium, potassium, brandName, servingSize, servingSizeUnit } = useLocalSearchParams();
    
    // Function to format to 2 significant figures
    const toSignificantFigures = (num: number, sigFigs: number = 2) => {
        if (num === 0 || num === null || num === undefined || isNaN(num)) return 0;
        const magnitude = Math.floor(Math.log10(Math.abs(num))) + 1;
        const multiplier = Math.pow(10, sigFigs - magnitude);
        return (Math.round(num * multiplier) / multiplier);
    };
    
    const [selectedMeal, setSelectedMeal] = useState('Breakfast');
    const [selectedServingSize, setSelectedServingSize] = useState(servingSize ? `${servingSize} ${servingSizeUnit}` : '1g');
    const [numberOfServings, setNumberOfServings] = useState('1');
    
    // Calculate serving size multiplier (if servingSize is provided, use it, otherwise use 1g)
    const servingSizeMultiplier = servingSize ? Number(servingSize) : 1;
    const numberOfServingsValue = Number(numberOfServings);
    const totalMultiplier = servingSizeMultiplier * numberOfServingsValue;
    
    // Calculate values for nutrition facts (based on serving size only, not number of servings)
    const nutritionFactsCalories = Number(calories) * servingSizeMultiplier;
    const nutritionFactsProtein = Number(protein) * servingSizeMultiplier;
    const nutritionFactsCarbohydrates = Number(carbohydrates) * servingSizeMultiplier;
    const nutritionFactsFat = Number(fat) * servingSizeMultiplier;
    const nutritionFactsFiber = Number(fiber) * servingSizeMultiplier;
    const nutritionFactsSugar = Number(sugar) * servingSizeMultiplier;
    const nutritionFactsSaturatedFat = Number(saturatedFat) * servingSizeMultiplier;
    const nutritionFactsPolyunsaturatedFat = Number(polyunsaturatedFat) * servingSizeMultiplier;
    const nutritionFactsMonounsaturatedFat = Number(monounsaturatedFat) * servingSizeMultiplier;
    const nutritionFactsTransFat = Number(transFat) * servingSizeMultiplier;
    const nutritionFactsCholesterol = Number(cholesterol) * servingSizeMultiplier;
    const nutritionFactsSodium = Number(sodium) * servingSizeMultiplier;
    
    // Calculate adjusted values based on serving size and number of servings (for display)
    const adjustedCalories = Number(calories) * totalMultiplier;
    const adjustedProtein = Number(protein) * totalMultiplier;
    const adjustedCarbohydrates = Number(carbohydrates) * totalMultiplier;
    const adjustedFat = Number(fat) * totalMultiplier;
    
    const [caloriesLabel, setCaloriesLabel] = useState(adjustedCalories.toFixed(0));
    const [carbsLabel, setCarbsLabel] = useState(toSignificantFigures(adjustedCarbohydrates));
    const [fatLabel, setFatLabel] = useState(toSignificantFigures(adjustedFat));
    const [proteinLabel, setProteinLabel] = useState(toSignificantFigures(adjustedProtein));

    const totalMacros = adjustedFat + adjustedCarbohydrates + adjustedProtein;
    
    // Function to handle serving size change
    const handleServingSizeChange = (value: string) => {
        setSelectedServingSize(value);
        
        // Parse the new serving size to get the multiplier
        let newServingSizeMultiplier = 1;
        if (value === '1g') {
            newServingSizeMultiplier = 1;
        } else if (servingSize && value === `${servingSize} ${servingSizeUnit}`) {
            newServingSizeMultiplier = Number(servingSize);
        }
        
        const newTotalMultiplier = newServingSizeMultiplier * numberOfServingsValue;
        
        setCaloriesLabel((Number(calories) * newTotalMultiplier).toFixed(0));
        setCarbsLabel(toSignificantFigures(Number(carbohydrates) * newTotalMultiplier));
        setFatLabel(toSignificantFigures(Number(fat) * newTotalMultiplier));
        setProteinLabel(toSignificantFigures(Number(protein) * newTotalMultiplier));
    };
    
    // Function to handle number of servings change
    const handleNumberOfServingsChange = (value: string) => {
        setNumberOfServings(value);
        const newNumberOfServings = Number(value);
        
        // Get current serving size multiplier based on selected serving size
        let currentServingSizeMultiplier = 1;
        if (selectedServingSize === '1g') {
            currentServingSizeMultiplier = 1;
        } else if (servingSize && selectedServingSize === `${servingSize} ${servingSizeUnit}`) {
            currentServingSizeMultiplier = Number(servingSize);
        }
        
        const newTotalMultiplier = currentServingSizeMultiplier * newNumberOfServings;
        
        setCaloriesLabel((Number(calories) * newTotalMultiplier).toFixed(0));
        setCarbsLabel(toSignificantFigures(Number(carbohydrates) * newTotalMultiplier));
        setFatLabel(toSignificantFigures(Number(fat) * newTotalMultiplier));
        setProteinLabel(toSignificantFigures(Number(protein) * newTotalMultiplier));
    };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1">
    <ScrollView className="px-4">
      <Text className="text-white text-2xl font-[HelveticaNeue]">{foodName}</Text>
      <Separator className="h-[0.3px] mt-5 mb-5" />
      <View className="flex-row items-center justify-between">
        <ProgressRing 
            size={100} 
            strokeWidth={6} 
            valueLabel={caloriesLabel} 
            subtitle="cal" 
            macrosFull={true}
            carbs={adjustedCarbohydrates}
            fat={adjustedFat}
            protein={adjustedProtein}
        />
        <View className='flex-row gap-12 items-center'>
            <View className="flex-col justify-center items-center">
                <Text className="text-carbs font-[HelveticaNeue]">{toSignificantFigures((adjustedCarbohydrates / totalMacros) * 100)}%</Text>
                <Text className="text-white text-xl font-[HelveticaNeue] font-bold">{carbsLabel}g</Text>
                <Text className="text-white font-[HelveticaNeue]">Carbs</Text>
            </View>
            <View className="flex-col justify-center items-center">
                <Text className="text-fat font-[HelveticaNeue]">{toSignificantFigures((adjustedFat / totalMacros) * 100)}%</Text>
                <Text className="text-white text-xl font-[HelveticaNeue] font-bold">{fatLabel}g</Text>
                <Text className="text-white font-[HelveticaNeue]">Fat</Text>
            </View>
            <View className="flex-col justify-center items-center">
                <Text className="text-protein font-[HelveticaNeue]">{toSignificantFigures((adjustedProtein / totalMacros) * 100)}%</Text>
                <Text className="text-white text-xl font-[HelveticaNeue] font-bold">{proteinLabel}g</Text>
                <Text className="text-white font-[HelveticaNeue]">Protein</Text>
            </View>
        </View>
      </View>
      <View className="flex-col mt-10">
        <View className="flex-col">
                 <Text className="text-white text-lg font-[HelveticaNeue]">Serving Size</Text>
                 <View className="border-gray2 border rounded-2xl overflow-hidden h-14 w-48 justify-center mt-4" style={{ backgroundColor: 'black' }}>
                     <Picker
                         selectedValue={selectedServingSize}
                         onValueChange={handleServingSizeChange}
                         style={{ 
                             backgroundColor: 'black',
                             color: 'white',
                             height: 56,
                             width: '100%'
                         }}
                         dropdownIconColor="white"
                         mode="dropdown"
                     >
                         {servingSize && (
                             <Picker.Item label={`${servingSize} ${servingSizeUnit}`} value={`${servingSize} ${servingSizeUnit}`} style={{ backgroundColor: 'black', color: 'white' }} />
                         )}
                         <Picker.Item label="1g" value="1g" style={{ backgroundColor: 'black', color: 'white' }} />
                     </Picker>
                 </View>
             </View>
                         <View className="flex-col gap-2 mt-4">
                 <Text className="text-white text-lg font-[HelveticaNeue]">Number of Servings</Text>
                 <TextInput
                     className="flex-row items-center text-white text-lg h-14 w-24 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
                     placeholder="1"
                     placeholderTextColor="#828282"
                     keyboardType="numeric"
                     value={numberOfServings}
                     onChangeText={handleNumberOfServingsChange}
                 />
             </View>
            <View className="flex-col gap-2 mt-4">
                <Text className="text-white text-lg font-[HelveticaNeue]">Time</Text>
                <TextInput
                    className="flex-row items-center text-white text-lg h-14 w-32 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
                    placeholder={`${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                    placeholderTextColor="#828282"
                    keyboardType="numeric"
                />
            </View>
            <View className="flex-col gap-2 mt-4">
                <Text className="text-white text-lg font-[HelveticaNeue]">Meal</Text>
                <View className="border-gray2 border rounded-2xl overflow-hidden h-14 w-48 justify-center">
                    <Picker
                        selectedValue={selectedMeal}
                        onValueChange={(itemValue) => setSelectedMeal(itemValue)}
                        style={{ 
                            backgroundColor: 'black',
                            color: 'white',
                        }}
                        dropdownIconColor="white"
                        mode="dropdown"
                    >
                        <Picker.Item label="Breakfast" value="Breakfast"  style={{ backgroundColor: 'black', color: 'white' }} />
                        <Picker.Item label="Lunch" value="Lunch"  style={{ backgroundColor: 'black', color: 'white' }} />
                        <Picker.Item label="Dinner" value="Dinner"  style={{ backgroundColor: 'black', color: 'white' }} />
                    </Picker>
                </View>
            </View>
       </View>
       
       <Separator className="h-[0.4px] mt-10 mb-5" />
       <Text className="text-white text-lg font-[HelveticaNeue] font-bold">Nutrition Facts</Text>
       <Separator className="h-[0.4px] mt-5 mb-5" />

               <View className="flex-col gap-10 w-full">
             <View className="flex-row justify-between gap-2 w-full">
                 <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Calories</Text>
                 <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{nutritionFactsCalories.toFixed(0)}</Text>
             </View>
             <View className="flex-col gap-2 w-full">
                 <View className="flex-row justify-between gap-2 w-full">
                     <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Total Fat</Text>
                     <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(nutritionFactsFat)}g</Text>
                 </View>

                 <View className='gap-4'>
                     <View className="flex-row justify-between gap-2 w-full">
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Saturated</Text>
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{nutritionFactsSaturatedFat ? `${toSignificantFigures(nutritionFactsSaturatedFat)}g` : "-"}</Text>
                     </View>
                     <View className="flex-row justify-between gap-2 w-full">
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Trans</Text>
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{nutritionFactsTransFat ? `${toSignificantFigures(nutritionFactsTransFat)}g` : "-"}</Text>
                     </View>
                     <View className="flex-row justify-between gap-2 w-full">
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Polyunsaturated</Text>
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{nutritionFactsPolyunsaturatedFat ? `${toSignificantFigures(nutritionFactsPolyunsaturatedFat)}g` : "-"}</Text>
                     </View>
                     <View className="flex-row justify-between gap-2 w-full">
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Monounsaturated</Text>
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{nutritionFactsMonounsaturatedFat ? `${toSignificantFigures(nutritionFactsMonounsaturatedFat)}g` : "-"}</Text>
                     </View>
                 </View>
             </View>
             <View className="flex-row justify-between gap-2 w-full">
                 <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Cholesterol</Text>
                 <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{nutritionFactsCholesterol ? `${nutritionFactsCholesterol.toFixed(0)}mg` : "0mg"}</Text>
             </View>
             <View className="flex-row justify-between gap-2 w-full">
                 <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Sodium</Text>
                 <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{nutritionFactsSodium ? `${nutritionFactsSodium.toFixed(0)}mg` : "0mg"}</Text>
             </View>
             <View className="flex-col gap-2 w-full">
                 <View className="flex-row justify-between gap-2 w-full">
                     <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Total Carbohydrates</Text>
                     <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(nutritionFactsCarbohydrates)}g</Text>
                 </View>

                 <View className='gap-4'>
                     <View className="flex-row justify-between gap-2 w-full">
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Dietary Fiber</Text>
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{nutritionFactsFiber ? `${toSignificantFigures(nutritionFactsFiber)}g` : "-"}</Text>
                     </View>
                     <View className="flex-row justify-between gap-2 w-full">
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Sugar</Text>
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{nutritionFactsSugar ? `${toSignificantFigures(nutritionFactsSugar)}g` : "-"}</Text>
                     </View>
                     <View className="flex-row justify-between gap-2 w-full">
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Added Sugars</Text>
                         <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{"N/A"}</Text>
                     </View>
                 </View>
             </View>
             <View className="flex-row justify-between gap-2 w-full mb-32">
                 <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Protein</Text>
                 <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(nutritionFactsProtein)}g</Text>
             </View>
             
         </View>
        </ScrollView>
            <GenericButton text="+ Log food" onPress={async () => {
             const token = await SecureStore.getItemAsync("jwtToken");
             
             // Calculate the current total multiplier based on selected serving size and number of servings
             let currentServingSizeMultiplier = 1;
             if (selectedServingSize === '1g') {
                 currentServingSizeMultiplier = 1;
             } else if (servingSize && selectedServingSize === `${servingSize} ${servingSizeUnit}`) {
                 currentServingSizeMultiplier = Number(servingSize);
             }
             const currentTotalMultiplier = currentServingSizeMultiplier * Number(numberOfServings);
             
             console.log(foodName, brandName, selectedServingSize, Number(numberOfServings), selectedMeal.toUpperCase(), new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), Number(calories) * currentTotalMultiplier, Number(protein) * currentTotalMultiplier, Number(carbohydrates) * currentTotalMultiplier, Number(fat) * currentTotalMultiplier, Number(fiber) * currentTotalMultiplier, Number(sugar) * currentTotalMultiplier, Number(saturatedFat) * currentTotalMultiplier, Number(polyunsaturatedFat) * currentTotalMultiplier, Number(monounsaturatedFat) * currentTotalMultiplier, Number(transFat) * currentTotalMultiplier, Number(cholesterol) * currentTotalMultiplier, Number(sodium) * currentTotalMultiplier, Number(potassium) * currentTotalMultiplier);
             
             fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/foods/logfood`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    foodName: foodName,
                    brandName: brandName,
                    servingSize: selectedServingSize,
                    servings: Number(numberOfServings),
                    mealType: selectedMeal.toUpperCase(),
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                    calories: Number(calories) * currentTotalMultiplier,
                    protein: Number(protein) * currentTotalMultiplier,
                    carbohydrates: Number(carbohydrates) * currentTotalMultiplier,
                    fat: Number(fat) * currentTotalMultiplier,
                    fiber: Number(fiber) * currentTotalMultiplier,
                    sugar: Number(sugar) * currentTotalMultiplier,
                    saturatedFat: Number(saturatedFat) * currentTotalMultiplier,
                    polyunsaturatedFat: Number(polyunsaturatedFat) * currentTotalMultiplier,
                    monounsaturatedFat: Number(monounsaturatedFat) * currentTotalMultiplier,
                    transFat: Number(transFat) * currentTotalMultiplier,
                    cholesterol: Number(cholesterol) * currentTotalMultiplier,
                    sodium: Number(sodium) * currentTotalMultiplier,
                    potassium: Number(potassium) * currentTotalMultiplier
                }),
            }).then(res => {
                if (res.ok) {
                    refreshMetrics();
                    router.back();
                }
            });
             
         }} className="self-center absolute bottom-20" textClassName="text-lg" />
    </SafeAreaView>
  )
}