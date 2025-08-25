import { router, Stack } from "expo-router";
import "../../global.css";
import BottomNavbar from "../../components/BottomNavbar";
import { StatusBar } from "expo-status-bar";
import { Pressable } from "react-native";
import ChevronLeftIcon from "../../assets/icons/ChevronLeftIcon";
import { UserContextProvider } from "../../context/UserContext";
import { MetricsContextProvider } from "../../context/MetricsContext";

export default function AppLayout() {
  return (
    <UserContextProvider>
      <MetricsContextProvider>
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
                className="w-10 h-10 items-start justify-center"
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
              name="(nutrition)/nutrition"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(nutrition)/logFoodSearch"
              options={{ headerShown: true, headerStyle: { backgroundColor: "#141414" }}}
            />
            <Stack.Screen name="(more)/more" options={{ headerShown: false }} />
          </Stack>
        <BottomNavbar />
      </MetricsContextProvider>
    </UserContextProvider>
  );
}
