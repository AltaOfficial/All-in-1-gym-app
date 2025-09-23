import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import GenericButton from '../../../components/GenericButton';
import { router } from "expo-router";
import { CreateWorkoutContext } from "../../../context/CreateWorkoutContext";
import { useContext } from "react";
import * as SecureStore from "expo-secure-store";

const NewWorkout = () => {
  const [workoutName, setWorkoutName] = useState('');
  const { exercises, clearContext } = useContext(CreateWorkoutContext);
  
  console.log(exercises);

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
            onChangeText={setWorkoutName}
            value={workoutName}
          />
          <GenericButton
            text="Save" 
            onPress={async () => {

              if (workoutName.trim() === '' || exercises.length === 0) {
                console.log('Workout name and exercises are required');
                return;
              }
              const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/workouts/create`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${await SecureStore.getItemAsync('jwtToken')}`,
                },
                body: JSON.stringify({
                  workoutName: workoutName,
                  exercises: exercises,
                }),
              });
              if (response.ok) {
                console.log('Workout created successfully');
                // clearContext();
                // router.back();
              } else {
                console.log('Workout creation failed');
              }
            }} 
            className="bg-red-500 py-4 w-[35%]"
            textClassName="text-white text-lg"
          />
        </View>

        {exercises.length > 0 && exercises.map((exercise, index) => (
          <View key={index} className="bg-gray1 rounded-xl p-4 mb-4">
            <Pressable className="flex-row items-center" onPress={() => {
              router.push(`/(app)/(training)/newExercise?exerciseIndex=${index}`);
            }}>
              {/* Exercise Image */}
              <View className="w-20 h-20 rounded-lg mr-4 items-center justify-center">
                <Image source={exercise.exerciseImageUrl ? { uri: exercise.exerciseImageUrl } : require('../../../assets/images/exercise example.png')} className="w-full h-full" />
              </View>
              
              {/* Exercise Details */}
              <View className="flex-1">
                <Text className="text-white text-base font-[HelveticaNeue] font-bold mb-1">
                  {exercise.exerciseName}
                </Text>
                <Text className="text-white text-sm font-[HelveticaNeue] mb-1">
                  {exercise.goalSets} sets
                </Text>
                <Text className="text-white text-sm font-[HelveticaNeue] mb-1">
                  {exercise.goalReps} reps each
                </Text>
                <Text className="text-gray3 text-xs font-[HelveticaNeue]">
                  {exercise.restTimeInSeconds} rest
                </Text>
              </View>
            </Pressable>
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
