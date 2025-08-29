import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import GenericButton from '../../../../components/GenericButton';
const CreateFood = () => {
  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
        <ScrollView className="flex-1">
            <View className="px-4 pb-28">
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Calories</Text>
                    <TextInput placeholder="Required" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Total Fat (g)</Text>
                    <TextInput placeholder="Optional" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Saturated Fat (g)</Text>
                    <TextInput placeholder="Optional" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Trans Fat (g)</Text>
                    <TextInput placeholder="Optional" numberOfLines={3} placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Polyunsaturated Fat (g)</Text>
                    <TextInput placeholder="Optional" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Monounsaturated Fat (g)</Text>
                    <TextInput placeholder="Optional" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Cholesterol (mg)</Text>
                    <TextInput placeholder="Optional" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Sodium (mg)</Text>
                    <TextInput placeholder="Optional" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Total Carbohydrates (g)</Text>
                    <TextInput placeholder="Optional" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Dietary Fiber (g)</Text>
                    <TextInput placeholder="Optional" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2 mt-4">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Total Sugars (g)</Text>
                    <TextInput placeholder="Optional" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
            </View>
        </ScrollView>
        <GenericButton text="Create Food" onPress={async () => {

             
         }} className="self-center absolute bottom-20" textClassName="text-lg" />
    </SafeAreaView>
  )
}
export default CreateFood
const styles = StyleSheet.create({})