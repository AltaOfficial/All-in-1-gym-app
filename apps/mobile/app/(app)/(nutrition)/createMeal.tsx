import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import EditIcon from '../../../assets/icons/EditIcon'
import ProgressRing from '../../../components/ProgressRing'
import Separator from '../../../components/Separator'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import GenericButton from '../../../components/GenericButton'

const CreateMeal = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);

    const toSignificantFigures = (num: number, sigFigs: number = 2) => {
        if (num === 0) return '0';
        const log10 = Math.log10(Math.abs(num));
        const sigFigsNeeded = Math.max(0, Math.ceil(log10));
        const multiplier = Math.pow(10, sigFigsNeeded - sigFigs);
        return Math.round(num * multiplier) / multiplier;
    }
    const proteinLabel = '100';
    const caloriesLabel = '1000';
    const adjustedCarbohydrates = 100;
    const adjustedFat = 100;
    const adjustedProtein = 100;
    const totalMacros = adjustedCarbohydrates + adjustedFat + adjustedProtein;
    const carbsLabel = '100';
    const fatLabel = '100';

    const foodItems = [
        {
            foodName: 'Apple',
            servingSize: '100g',
            servings: 1,
            calories: 100,
            time: '12:00',
            fat: 10,
            saturatedFat: 10,
            transFat: 10,
            polyunsaturatedFat: 10,
            monounsaturatedFat: 10,
            cholesterol: 10,
            sodium: 10,
            carbohydrates: 10,
            fiber: 10,
            sugar: 10,
            protein: 10
        }
    ]

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View>
            <Image source={imageUri ? { uri: imageUri } : require('../../../assets/images/example meal.png')} className="w-full h-60" />
            <View className="flex-row items-center justify-between absolute bottom-4 right-4">
                <EditIcon height={25} width={25} fill="white" />
            </View>
        </View>
        <View className="px-4">
            <View className="flex-col gap-2 mt-4">
                <Text className='text-white text-lg font-[HelveticaNeue]'>Meal Name</Text>
                <TextInput placeholder="Name Your Meal" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
            </View>
        </View>

        <View className="flex-row items-center justify-between px-4 mt-6 mb-4">
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
        <Separator className="h-[0.4px] mt-6"/>
        <View className="px-4">
            <View className='flex-row justify-between items-center my-3 h-12'>
                <Text className='text-white text-xl font-[HelveticaNeue] font-bold'>Meal Items</Text>
                <TouchableOpacity onPress={() => router.push('/(app)/(nutrition)/logFoodSearch')}>
                    <Text className='text-primary text-lg font-[HelveticaNeue]'>Add Food</Text>
                </TouchableOpacity>
            </View>
        </View>
        <Separator className="h-[0.4px]"/>
        {foodItems.map((item, index) => (
            <View key={index} className='flex-row justify-between items-center px-4 my-3'>
                <View>
                    <Text className='text-white text-lg font-[HelveticaNeue]'>{item.foodName.length > 28 ? item.foodName.substring(0,25) + '...' : item.foodName}</Text>
                    <Text className='text-gray3 font-[HelveticaNeue]'>{item.servingSize} {item.servings ? `(${item.servings} servings)` : ''}</Text>
                </View>
                <View className='flex-col items-end gap-2'>
                    <Text className='text-white text-lg font-[HelveticaNeue] font-bold'>{item.calories?.toFixed(0) ?? 0} cal</Text>
                </View>
            </View>
        ))}
        <Separator className="h-[0.4px] mt-6"/>
        <Text className="text-white text-lg font-[HelveticaNeue] font-bold my-6 px-4">Nutrition Facts</Text>
        <Separator className="h-[0.4px] mb-5" />
        <View className="flex-col gap-10 w-full px-4">
            <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Calories</Text>
                <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{foodItems.reduce((acc, item) => acc + item.calories, 0).toFixed(0)}</Text>
            </View>
            <View className="flex-col gap-2 w-full">
                <View className="flex-row justify-between gap-2 w-full">
                    <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Total Fat</Text>
                    <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.fat, 0))}</Text>
                </View>

                <View className='gap-4'>
                    <View className="flex-row justify-between gap-2 w-full">
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Saturated</Text>
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.saturatedFat, 0))}</Text>
                    </View>
                    <View className="flex-row justify-between gap-2 w-full">
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Trans</Text>
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.transFat, 0))}</Text>
                    </View>
                    <View className="flex-row justify-between gap-2 w-full">
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Polyunsaturated</Text>
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.polyunsaturatedFat, 0))}</Text>
                    </View>
                    <View className="flex-row justify-between gap-2 w-full">
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Monounsaturated</Text>
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.monounsaturatedFat, 0))}</Text>
                    </View>
                </View>
            </View>
            <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Cholesterol</Text>
                <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.cholesterol, 0))}</Text>
            </View>
            <View className="flex-row justify-between gap-2 w-full">
                <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Sodium</Text>
                <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.sodium, 0))}</Text>
            </View>
            <View className="flex-col gap-2 w-full">
                <View className="flex-row justify-between gap-2 w-full">
                    <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Total Carbohydrates</Text>
                    <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.carbohydrates, 0))}</Text>
                </View>

                <View className='gap-4'>
                    <View className="flex-row justify-between gap-2 w-full">
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Dietary Fiber</Text>
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.fiber, 0))}</Text>
                    </View>
                    <View className="flex-row justify-between gap-2 w-full">
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Sugar</Text>
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.sugar, 0))}</Text>
                    </View>
                    <View className="flex-row justify-between gap-2 w-full">
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] px-4 font-medium">Added Sugars</Text>
                        <Text className="text-gray3 text-lg font-[HelveticaNeue] font-medium">{"N/A"}</Text>
                    </View>
                </View>
            </View>
            <View className="flex-row justify-between gap-2 w-full mb-32">
                <Text className="text-white text-lg font-[HelveticaNeue] font-medium">Protein</Text>
                <Text className="text-white text-lg font-[HelveticaNeue] font-medium">{toSignificantFigures(foodItems.reduce((acc, item) => acc + item.protein, 0))}</Text>
            </View>       
        </View>
      </ScrollView>
      <GenericButton text="Create Meal" onPress={async () => {
        
        }} className="self-center absolute bottom-20" textClassName="text-lg" />
    </SafeAreaView>
  )
}
export default CreateMeal