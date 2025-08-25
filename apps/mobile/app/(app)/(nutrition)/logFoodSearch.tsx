import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import SearchIcon from '../../../assets/icons/SearchIcon'
import { useState } from 'react';
import BarcodeIcon from '../../../assets/icons/BarcodeIcon';
import FoodSearchItem from '../../../components/FoodSearchItem';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LogFoodSearch() {

    const [selectedTab, setSelectedTab] = useState('all');
  return (
    <SafeAreaView edges={['bottom']} className="flex-1">
      <View className="bg-gray1 px-10">
        <View className="flex-row items-center gap-4 px-6 border border-white rounded-full"> 
            <SearchIcon height={20} width={20} fill="#828282" />
            <TextInput
            placeholder={selectedTab === 'all' ? "Search foods" : selectedTab === 'myMeals' ? "Search My Meals" : "Search My Foods"}
            placeholderTextColor="#828282"
            className="text-white font-[HelveticaNeue]"
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

     <ScrollView className="flex-1">
            <View className="px-6 mt-8">
                <View className="flex-row items-center gap-4 bg-gray1 rounded-xl py-3 px-4">
                    <BarcodeIcon height={80} width={80} fill="white" />
                    <View>
                        <Text className="text-white text-2xl font-[HelveticaNeue]">Scan Barcode</Text>
                        <Text className="text-white text-xs font-[HelveticaNeue]">{"Find your food instantly by scanning \nthe barcode on it"}</Text>
                    </View>
                </View>
            </View>

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
        </ScrollView>
    </SafeAreaView>
  )
}