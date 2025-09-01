import { FlatList, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Separator from '../../../../components/Separator'
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeftIcon'
import ChevronRightIcon from '../../../../assets/icons/ChevronRightIcon'
import Checkbox from '../../../../components/Checkbox'
import { useEffect, useContext } from 'react';
import { GroceryListContext } from '../../../../context/GroceryListContext';
import * as SecureStore from 'expo-secure-store';
import { GroceryListItemType } from '../../../../types/groceryListItemType';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue, withSpring } from 'react-native-reanimated';
import Animated from "react-native-reanimated";
import { useAnimatedStyle } from 'react-native-reanimated';
import { deleteGroceryItem } from '../../../../services/deleteGroceryItem';
import { useIsFocused } from '@react-navigation/native';

const GroceryList = () => {
  const { dateFrom, setDateFrom, dateTo, setDateTo, groceryList, setGroceryList } = useContext(GroceryListContext);
  const isFocused = useIsFocused();
  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/grocerylist`, {
      method: 'POST',
      body: JSON.stringify({ dateFrom, dateTo }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SecureStore.getItem('jwtToken')}`,
      },
    }).then(async res => {
      if (res.ok) {
        const data = await res.json();
        setGroceryList(data);
      }
    });
  }, [dateFrom, dateTo]);

  const GroceryItem = ({ item }: { item: GroceryListItemType }) => {
    const translateX = useSharedValue(0);
    
    // Create a wrapper function for deletion as suggested in the documentation
    const handleDelete = async () => {
      try {
        const updatedList = await deleteGroceryItem(item, dateFrom ?? new Date(), dateTo ?? new Date(), groceryList ?? []);
        if (updatedList) {
          setGroceryList(updatedList);
        }else{
          setGroceryList(groceryList ?? []);
          translateX.value = withSpring(0);
        }
      } catch (error) {
        console.error("Error in deletion:", error);
        // Revert animation if deletion failed
        translateX.value = withSpring(0);
      }
    };
    
    const panGestureHandler = Gesture.Pan()
      .onChange((event) => {
        translateX.value = event.translationX;
      })
      .onFinalize((event) => {
        if (event.translationX < -100 || event.translationX > 100) {
          // Animate off screen
          const direction = event.translationX < 0 ? -200 : 200;
          translateX.value = withSpring(direction);
          
          // Use the wrapper function with runOnJS
          runOnJS(handleDelete)();
        } else {
          translateX.value = withSpring(0);
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    return (
      <GestureDetector gesture={panGestureHandler}>
        <Animated.View className="flex-row justify-between items-center bg-gray1 rounded-xl p-4 mb-3 mx-4" style={animatedStyle}>
          <View className="flex-1">
            <Text className="text-white text-base font-[HelveticaNeue] mb-1">{item.itemName}</Text>
            <Text className="text-gray3 text-sm font-[HelveticaNeue]">{item.quantity} item{item.quantity > 1 ? 's' : ''}, ${(item.cost * item.quantity).toFixed(2)} total</Text>
          </View>
          <Checkbox className='!px-2' checked={item.isBought} onPress={async () => {
            try {
              const token = await SecureStore.getItemAsync('jwtToken');
              const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/grocerylist/bought`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                  dateFrom: dateFrom?.toISOString(),
                  dateTo: dateTo?.toISOString(),
                  groceryListItemDto: {
                    id: item.id,
                    itemName: item.itemName,
                    quantity: item.quantity,
                    cost: item.cost,
                    isBought: !item.isBought
                  }
                }),
              });
              
                if (response.ok) {
                  // Update the local state while maintaining order
                  const updatedList = groceryList?.map((listItem: GroceryListItemType) => 
                    listItem.id === item.id 
                      ? { ...listItem, isBought: !item.isBought }
                      : listItem
                  ) ?? [];
                  setGroceryList(updatedList);
                }
            } catch (error) {
              console.error('Error updating grocery item:', error);
            }
          }} />
        </Animated.View>
      </GestureDetector>
    );
  };

  const renderGroceryItem = ({ item }: { item: GroceryListItemType }) => (
    <GroceryItem item={item} />
  )

  const formatDateRange = (from: string, to: string) => {
    const today = new Date();
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    // Check if today is within the date range
    const isCurrentWeek = today >= fromDate && today <= toDate;
    
    if (isCurrentWeek) {
      return "This week";
    }
    
    return `${fromDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${toDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  const totalCost = groceryList?.reduce((acc, item) => acc + item.cost * item.quantity, 0) ?? 0;

  return (
    <SafeAreaView edges={['bottom']} className="flex-1">
      <View className="flex-1">
        <Separator className='h-[0.4px]'/>
        <View className='flex-row justify-center items-center my-3 gap-6'>
            <Pressable onPress={() => {
             if (dateFrom && dateTo) {
               const newFrom = (new Date(dateFrom)).setDate(dateFrom.getDate() - 7);
               setDateFrom(new Date(newFrom));
               
               const newTo = (new Date(dateTo)).setDate(dateTo.getDate() - 7);
               setDateTo(new Date(newTo));
             }
           }}>
             <ChevronLeftIcon height={20} width={20} fill='white'/>
           </Pressable>
           <Text className='text-white font-[HelveticaNeue] text-lg font-bold'>{formatDateRange(dateFrom?.toISOString() || '', dateTo?.toISOString() || '')}</Text>
           <Pressable onPress={() => {
             if (dateFrom && dateTo) {
               const newFrom = (new Date(dateFrom)).setDate(dateFrom.getDate() + 7);
               setDateFrom(new Date(newFrom));
               
               const newTo = (new Date(dateTo)).setDate(dateTo.getDate() + 7);
               setDateTo(new Date(newTo));
             }
           }}>
             <ChevronRightIcon height={20} width={20} fill='white'/>
           </Pressable>
        </View>
        <Separator className='h-[0.4px]'/>
        <View className='flex-row justify-between items-center px-4'>
          <Text className='text-white font-[HelveticaNeue] text-lg font-bold'>Grocery List</Text>
          <View className='flex-row items-center my-5'>
              <Text className='text-white font-[HelveticaNeue]'>Est. Cost: </Text>
              <Text className='text-white font-[HelveticaNeue] text-lg font-bold'>${totalCost.toFixed(2)}</Text>
          </View>
        </View>
        <Separator className='h-[0.4px] mb-6'/>
        {/* we need isFocused because, the animation view stays active when navigating to addToGroceryList, and prevents button presses from registering */}
        {isFocused && <FlatList
          data={groceryList}
          renderItem={renderGroceryItem}
          className='flex-1'
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />}
      </View>
    </SafeAreaView>
  )
}
export default GroceryList