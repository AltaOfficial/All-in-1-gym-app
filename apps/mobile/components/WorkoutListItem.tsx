import { View, Text, Pressable, TouchableOpacity } from "react-native";
import GenericButton from "./GenericButton";
import MoreIconVertical from "../assets/icons/MoreIconVertical";
import { WorkoutType } from "../types/ExerciseTypes";
import { useState } from "react";

const WorkoutListItem = ({ workout, onStartPress, onDelete, onEdit }: { workout: WorkoutType, onStartPress: () => void, onDelete: () => void, onEdit: () => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <View className="flex-row justify-between items-center mb-4 p-3">
      <Text className="text-white text-lg font-[HelveticaNeue]">
        {workout.workoutName}
      </Text>
      <View className="flex-row items-center gap-2">
        <GenericButton
          text="Start"
          className="w-32 py-1"
          onPress={onStartPress}
        />
        <View className="relative">
          <Pressable
            onPress={() => {
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <MoreIconVertical width={25} height={25} fill="white" />
          </Pressable>
          
          {isDropdownOpen && (
            <View className="absolute top-8 right-0 bg-white rounded-lg shadow-lg z-50 min-w-32">
              <TouchableOpacity
                onPress={() => {
                  onEdit();
                  setIsDropdownOpen(false);
                }}
                className="px-4 py-3 border-b border-gray-200"
              >
                <Text className="text-black text-base font-[HelveticaNeue]">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onDelete();
                  setIsDropdownOpen(false);
                }}
                className="px-4 py-3"
              >
                <Text className="text-red-600 text-base font-[HelveticaNeue]">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default WorkoutListItem;
