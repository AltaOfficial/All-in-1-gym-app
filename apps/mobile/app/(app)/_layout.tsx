import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../../global.css";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../../components/BottomNavbar";
import { StatusBar } from "expo-status-bar";

export default function AppLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView className="bg-black flex-1">
        <Stack
          screenOptions={{
            animation: "none",
            contentStyle: { backgroundColor: "black" },
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
          <Stack.Screen name="(more)/more" options={{ headerShown: false }} />
        </Stack>
        <BottomNavbar />
      </SafeAreaView>
    </>
  );
}
