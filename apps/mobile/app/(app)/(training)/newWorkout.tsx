import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GenericButton from "../../../components/GenericButton";
import { router, useLocalSearchParams } from "expo-router";
import { CreateWorkoutContext } from "../../../context/CreateWorkoutContext";
import { useContext } from "react";
import * as SecureStore from "expo-secure-store";
import Animated, {
  runOnJS,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");
const ITEM_HEIGHT = 140; // Approximate height of each exercise item

// Draggable Exercise Item Component with Swipe to Delete
const DraggableExerciseItem = ({
  exercise,
  index,
  onDelete,
  onReorder,
  isDragging,
  draggedIndex,
  targetIndex,
  totalItems,
}: {
  exercise: any;
  index: number;
  onDelete: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  isDragging: ReturnType<typeof useSharedValue<number>>;
  draggedIndex: ReturnType<typeof useSharedValue<number>>;
  targetIndex: ReturnType<typeof useSharedValue<number>>;
  totalItems: number;
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const isGestureActive = useSharedValue(false);
  const startY = useSharedValue(0);

  const handleDelete = () => {
    onDelete(index);
  };

  const handleReorder = (from: number, to: number) => {
    onReorder(from, to);
  };

  // Long press gesture for dragging
  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      isGestureActive.value = true;
      isDragging.value = index;
      draggedIndex.value = index;
      targetIndex.value = index;
      startY.value = 0;
      scale.value = withSpring(1.05);
    });

  // Pan gesture for both swiping and dragging
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isGestureActive.value) {
        // Dragging mode (vertical)
        translateY.value = event.translationY;

        // Calculate which position we're hovering over
        const draggedY = event.translationY;
        const newTargetIndex = Math.round(draggedY / ITEM_HEIGHT) + draggedIndex.value;
        const clampedTargetIndex = Math.max(0, Math.min(totalItems - 1, newTargetIndex));

        targetIndex.value = clampedTargetIndex;
      } else {
        // Swipe mode (horizontal)
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (isGestureActive.value) {
        // End dragging - store values before resetting
        const finalIndex = targetIndex.value;
        const startIndex = draggedIndex.value;

        if (finalIndex !== startIndex) {
          runOnJS(handleReorder)(startIndex, finalIndex);
        }

        // Reset states and animate back
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        isGestureActive.value = false;
        isDragging.value = -1;
        draggedIndex.value = -1;
        targetIndex.value = -1;
      } else {
        // End swiping
        const threshold = screenWidth * 0.3;

        if (Math.abs(event.translationX) > threshold) {
          const direction = event.translationX > 0 ? screenWidth : -screenWidth;
          translateX.value = withSpring(direction, {
            damping: 20,
            stiffness: 300,
          });
          opacity.value = withSpring(0, { damping: 20, stiffness: 300 }, () => {
            runOnJS(handleDelete)();
          });
        } else {
          translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
        }
      }
    });

  const gesture = Gesture.Simultaneous(longPressGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    // If this item is being dragged
    if (isDragging.value === index) {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { scale: scale.value },
        ],
        opacity: opacity.value,
        zIndex: 1000,
      };
    }

    // If another item is being dragged, shift this item to make space
    if (isDragging.value !== -1) {
      const draggedIdx = draggedIndex.value;
      const targetIdx = targetIndex.value;

      let offset = 0;

      // If dragging down (draggedIdx < targetIdx)
      if (draggedIdx < targetIdx) {
        // Items between dragged and target should move up
        if (index > draggedIdx && index <= targetIdx) {
          offset = -ITEM_HEIGHT;
        }
      }
      // If dragging up (draggedIdx > targetIdx)
      else if (draggedIdx > targetIdx) {
        // Items between target and dragged should move down
        if (index < draggedIdx && index >= targetIdx) {
          offset = ITEM_HEIGHT;
        }
      }

      return {
        transform: [
          { translateX: translateX.value },
          { translateY: withSpring(offset, { damping: 15, stiffness: 200 }) },
          { scale: scale.value },
        ],
        opacity: opacity.value,
        zIndex: 1,
      };
    }

    // Normal state
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: 0 },
        { scale: scale.value },
      ],
      opacity: opacity.value,
      zIndex: 1,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <View className="bg-gray1 rounded-xl p-4 mb-4">
          <Pressable
            className="flex-row items-center"
            onPress={() => {
              router.push(
                `/(app)/(training)/newExercise?exerciseIndex=${index}`
              );
            }}
          >
            {/* Exercise Image */}
            <View className="w-20 h-20 rounded-lg mr-4 items-center justify-center">
              <Image
                source={
                  exercise.exerciseImageUrl
                    ? { uri: exercise.exerciseImageUrl }
                    : require("../../../assets/images/exercise example.png")
                }
                className="w-full h-full"
              />
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
      </Animated.View>
    </GestureDetector>
  );
};

const NewWorkout = () => {
  const { workoutId } = useLocalSearchParams();
  const { exercises, clearContext, setWorkoutName, setExercises, workoutName, refreshWorkouts } =
    useContext(CreateWorkoutContext);

  // Shared values for drag-and-drop
  const isDragging = useSharedValue(-1);
  const draggedIndex = useSharedValue(-1);
  const targetIndex = useSharedValue(-1);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newExercises = [...exercises];
    const [removed] = newExercises.splice(fromIndex, 1);
    newExercises.splice(toIndex, 0, removed);
    setExercises(newExercises);
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-black">
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
              if (workoutName.trim() === "" || exercises.length === 0) {
                console.log("Workout name and exercises are required");
                return;
              }

              let response;
              if (workoutId) {
                response = await fetch(
                  `${process.env.EXPO_PUBLIC_BACKEND_URL}/workouts/update`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${await SecureStore.getItemAsync(
                        "jwtToken"
                      )}`,
                    },
                    body: JSON.stringify({
                      id: workoutId,
                      workoutName: workoutName,
                      exercises: exercises,
                    }),
                  }
                );
              } else {
                response = await fetch(
                  `${process.env.EXPO_PUBLIC_BACKEND_URL}/workouts/create`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${await SecureStore.getItemAsync(
                        "jwtToken"
                      )}`,
                    },
                    body: JSON.stringify({
                      workoutName: workoutName,
                      exercises: exercises,
                    }),
                  }
                );
              }
              if (response?.ok) {
                await refreshWorkouts();
                router.back();
                clearContext();
              } else {
                console.log("Workout creation/update failed");
              }
            }}
            className="bg-red-500 py-4 w-[35%]"
            textClassName="text-white text-lg"
          />
        </View>

        {/* Exercise List */}
        {exercises.length > 0 &&
          exercises.map((exercise, index) => (
            <DraggableExerciseItem
              key={index}
              exercise={exercise}
              index={index}
              onDelete={() =>
                setExercises(exercises.filter((_, i) => i !== index))
              }
              onReorder={handleReorder}
              isDragging={isDragging}
              draggedIndex={draggedIndex}
              targetIndex={targetIndex}
              totalItems={exercises.length}
            />
          ))}

        {/* Add New Exercise Button */}
        <TouchableOpacity
          onPress={() => {
            router.push("/(app)/(training)/newExercise");
          }}
          className="bg-gray1 rounded-xl p-4 mb-6"
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-white font-[HelveticaNeue]">
              + New Exercise
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewWorkout;
