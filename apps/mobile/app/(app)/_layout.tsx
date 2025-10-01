import { router, Stack } from "expo-router";
import "../../global.css";
import BottomNavbar from "../../components/BottomNavbar";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text } from "react-native";
import ChevronLeftIcon from "../../assets/icons/ChevronLeftIcon";
import { UserContextProvider } from "../../context/UserContext";
import { MetricsContextProvider } from "../../context/MetricsContext";
import { GroceryListContextProvider } from "../../context/GroceryListContext";
import { RecipeProvider } from "../../context/RecipeContext";
import { CreateWorkoutProvider } from "../../context/CreateWorkoutContext";
import { WorkoutProvider } from "../../context/WorkoutContext";
import { useContext, useState } from "react";
import { WorkoutContext } from "../../context/WorkoutContext";
import XIcon from "../../assets/icons/XIcon";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AppLayout() {
  return (
    <UserContextProvider>
      <GroceryListContextProvider>
        <MetricsContextProvider>
          <WorkoutProvider>
            <RecipeProvider>
              <CreateWorkoutProvider>
                <StatusBar style="auto" />
                <Stack
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: "black",
                    },
                    contentStyle: {
                      backgroundColor: "black",
                    },
                    headerTitle: "",
                    headerLeft: () => (
                      <Pressable
                        className="w-14 h-14 items-start justify-center z-20"
                        onPress={() => router.back()}
                      >
                        <ChevronLeftIcon height={20} width={20} fill="white" />
                      </Pressable>
                    ),
                  }}
                >
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(training)/training"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(training)/workout"
                    options={{
                      headerShown: true,
                      headerLeft: () => false,
                      headerRight: () => {
                        const { endWorkout } = useContext(WorkoutContext);
                        const [visible, setVisible] = useState(false);

                        return (
                          <>
                            <ConfirmationModal
                              visible={visible}
                              setVisible={setVisible}
                              text="Are you sure you want to end the workout?"
                              onYes={() => {
                                setVisible(false);
                                endWorkout();
                                router.push("/(app)/(training)/training");
                              }}
                            />
                            <Pressable
                              className="items-center justify-center"
                              onPress={() => {
                                setVisible(true);
                              }}
                            >
                              <XIcon height={35} width={35} fill="white" />
                            </Pressable>
                          </>
                        );
                      },
                    }}
                  />
                  <Stack.Screen
                    name="(nutrition)/nutrition"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(nutrition)/logFoodSearch"
                    options={{
                      headerShown: true,
                      headerStyle: { backgroundColor: "#141414" },
                    }}
                  />
                  <Stack.Screen
                    name="(nutrition)/(createFood)/createFoodBasic"
                    options={{
                      headerShown: true,
                      headerStyle: { backgroundColor: "black" },
                      headerRight: () => {
                        return (
                          <Pressable
                            className="w-14 h-14 items-center justify-center z-20"
                            onPress={() =>
                              router.push(
                                "/(app)/(nutrition)/(createFood)/createFoodNutrients"
                              )
                            }
                          >
                            <Text className="text-white text-lg font-[HelveticaNeue]">
                              Next
                            </Text>
                          </Pressable>
                        );
                      },
                    }}
                  />
                  <Stack.Screen
                    name="(nutrition)/(createRecipe)/createRecipeInfo"
                    options={{
                      headerShown: true,
                      headerStyle: { backgroundColor: "black" },
                      headerRight: () => {
                        return (
                          <Pressable
                            className="w-14 h-14 items-center justify-center z-20"
                            onPress={() =>
                              router.push(
                                "/(app)/(nutrition)/(createRecipe)/createRecipeIngredients"
                              )
                            }
                          >
                            <Text className="text-white text-lg font-[HelveticaNeue]">
                              Next
                            </Text>
                          </Pressable>
                        );
                      },
                    }}
                  />
                  <Stack.Screen
                    name="(nutrition)/(createRecipe)/createRecipeIngredients"
                    options={{
                      headerShown: true,
                      headerStyle: { backgroundColor: "black" },
                      headerRight: () => {
                        return (
                          <Pressable
                            className="h-14 items-center justify-center z-20"
                            onPress={() =>
                              router.push(
                                "/(app)/(nutrition)/logFoodSearch?searchType=recipe"
                              )
                            }
                          >
                            <Text className="text-white text-lg font-[HelveticaNeue]">
                              Add Ingredients +
                            </Text>
                          </Pressable>
                        );
                      },
                    }}
                  />
                  <Stack.Screen
                    name="(nutrition)/createMeal"
                    options={{
                      headerShown: true,
                      headerTransparent: true,
                      headerStyle: { backgroundColor: "transparent" },
                    }}
                  />
                  <Stack.Screen
                    name="(nutrition)/(grocery)/groceryList"
                    options={{
                      headerShown: true,
                      headerStyle: { backgroundColor: "black" },
                      headerRight: () => {
                        return (
                          <Pressable
                            className="w-28 h-14 items-center justify-center z-20"
                            onPress={({ nativeEvent }) => {
                              console.log(
                                "Native event:",
                                nativeEvent.locationX
                              );
                              console.log("Adding item to grocery list");
                              router.push(
                                "/(app)/(nutrition)/(grocery)/addToGroceryList"
                              );
                            }}
                          >
                            <Text className="text-white text-lg font-[HelveticaNeue]">
                              + Add Item
                            </Text>
                          </Pressable>
                        );
                      },
                    }}
                  />
                  <Stack.Screen
                    name="(more)/more"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(bodyMetrics)/bodyMetrics"
                    options={{
                      headerShown: true,
                      headerRight: () => {
                        return (
                          <Pressable
                            className="w-28 h-14 items-end justify-center z-20"
                            onPress={() =>
                              router.push(
                                "/(app)/(bodyMetrics)/addDailyMetrics"
                              )
                            }
                          >
                            <Text className="text-white text-4xl font-[HelveticaNeue]">
                              +
                            </Text>
                          </Pressable>
                        );
                      },
                    }}
                  />
                </Stack>
                <BottomNavbar />
              </CreateWorkoutProvider>
            </RecipeProvider>
          </WorkoutProvider>
        </MetricsContextProvider>
      </GroceryListContextProvider>
    </UserContextProvider>
  );
}
