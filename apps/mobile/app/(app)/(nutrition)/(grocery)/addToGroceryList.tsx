import { Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import GenericButton from '../../../../components/GenericButton';
import { useContext, useState } from 'react';
import { GroceryListContext } from '../../../../context/GroceryListContext';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const AddToGroceryList = () => {
    const { dateFrom, dateTo, refreshGroceryList } = useContext(GroceryListContext);
    const [itemName, setItemName] = useState('');
    const [cost, setCost] = useState('');
    const [quantity, setQuantity] = useState('');

    console.log(itemName, cost, quantity);


    return (
        <SafeAreaView edges={['bottom']} className="flex-1">
            <View className="px-4">
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Item Name</Text>
                    <TextInput onChangeText={(text) => setItemName(text)} placeholder="ex. Swedish Fish" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Cost</Text>
                    <TextInput onChangeText={(text) => setCost(text)} placeholder="1" keyboardType="numeric" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-44 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Quantity</Text>
                    <TextInput onChangeText={(text) => setQuantity(text)} placeholder="1" keyboardType="numeric" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-44 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
            </View>
            <GenericButton text="+ Add Item" onPress={async () => {
                console.log(itemName, cost, quantity);
                if (itemName === '' || cost === '' || quantity === '') {
                    console.error("Please fill in all fields");
                    return;
                }
                await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/grocerylist/add`, {
                    method: 'POST',
                    body: JSON.stringify({ dateFrom, dateTo, groceryListItemDto: { itemName, cost: Number(cost), quantity: Number(quantity) } }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`,
                    },
                }).then(async res => {
                    if (res.ok) {
                        refreshGroceryList();
                        router.back();
                    }else{
                        console.error("Error adding item to grocery list");
                    }
                });
            }} className="self-center absolute bottom-20" textClassName="text-lg" />
        </SafeAreaView> 
      )
}
export default AddToGroceryList