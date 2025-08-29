import { Text, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';

const CreateFood = () => {
  const [selectedUnit, setSelectedUnit] = useState('g');

  return (
    <View>
        <View className="px-4">
            <View className="flex-col gap-2 mt-4">
                <Text className='text-white text-lg font-[HelveticaNeue]'>Brand Name</Text>
                <TextInput placeholder="ex. Campbell's" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
            </View>
            <View className="flex-col gap-2 mt-4">
                <Text className='text-white text-lg font-[HelveticaNeue]'>Description (Required)</Text>
                <TextInput placeholder="ex. Chicken soup" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
            </View>
            <View className="flex-col gap-2 mt-4">
                <Text className='text-white text-lg font-[HelveticaNeue]'>Serving Size (Required)</Text>
                <View className="flex-row gap-4 justify-between w-full">
                    <TextInput placeholder="1" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-44 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                    <View className="border-gray2 border rounded-2xl overflow-hidden h-[3.7rem] w-44 justify-center">
                        <Picker
                            selectedValue={selectedUnit}
                            onValueChange={(itemValue) => setSelectedUnit(itemValue)}
                            style={{ 
                                backgroundColor: 'black',
                                color: 'white',
                                height: 56,
                                width: '100%'
                            }}
                            dropdownIconColor="white"
                            mode="dropdown"
                        >
                            <Picker.Item label="g" value="g" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="kg" value="kg" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="mg" value="mg" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="mcg" value="mcg" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="oz" value="oz" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="lb" value="lb" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="ml" value="ml" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="l" value="l" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="cup" value="cup" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="fl oz" value="fl_oz" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="pint" value="pint" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="quart" value="quart" style={{ backgroundColor: 'black', color: 'white' }} />
                            <Picker.Item label="gallon" value="gallon" style={{ backgroundColor: 'black', color: 'white' }} />
                        </Picker>
                    </View>
                </View>
            </View>
        </View>
    </View>
  )
}
export default CreateFood