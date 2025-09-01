import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import GenericButton from '../../../components/GenericButton';
import { router } from "expo-router";

const NewWorkout = () => {

  const exercises = [
    {
      image: require('../../../assets/images/exercise example.png'),
      name: 'Close Grip barbell bench press',
      sets: 3,
      reps: '8-10',
      rest: '180s'
    }
  ]

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-black">
      <ScrollView className="flex-1 px-4">
        {/* Top Navigation and Input Area */}

        {/* Workout Name Input */}
        <View className="mb-6 gap-4 pr-2 flex-row justify-between items-center w-full">
          <TextInput 
            placeholder="Workout name" 
            placeholderTextColor="#828282"
            className="text-white text-lg h-16 w-[60%] font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
          />
          <GenericButton 
            text="Save" 
            onPress={() => {}} 
            className="bg-red-500 py-4 w-[35%]"
            textClassName="text-white text-lg"
          />
        </View>

        {exercises.map((exercise, index) => (
        <View key={index} className="bg-gray1 rounded-xl p-4 mb-4">
          <View className="flex-row items-center">
            {/* Exercise Image */}
            <View className="w-20 h-20 rounded-lg mr-4 items-center justify-center">
              <Image source={exercise.image} className="w-full h-full" />
            </View>
            
            {/* Exercise Details */}
            <View className="flex-1">
              <Text className="text-white text-base font-[HelveticaNeue] font-bold mb-1">
                {exercise.name}
              </Text>
              <Text className="text-white text-sm font-[HelveticaNeue] mb-1">
                {exercise.sets} sets
              </Text>
              <Text className="text-white text-sm font-[HelveticaNeue] mb-1">
                {exercise.reps} reps each
              </Text>
              <Text className="text-gray3 text-xs font-[HelveticaNeue]">
                {exercise.rest} rest
              </Text>
            </View>
          </View>
        </View>
        ))}

        {/* Add New Exercise Button */}
        <TouchableOpacity onPress={() => {
          router.push('/(app)/(training)/newExercise');
        }} className="bg-gray1 rounded-xl p-4 mb-6">
          <View className="flex-row items-center justify-center">
            <Text className="text-white font-[HelveticaNeue]">+ New Exercise</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewWorkout;
