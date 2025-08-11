import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../components/BottomNavbar";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    HelveticaNueue: require("../assets/fonts/HelveticaNeueRoman.otf"),
    HelveticaNueueBoldItalic: require("../assets/fonts/HelveticaNeueBoldItalic.otf"),
    HelveticaNeueMedium: require("../assets/fonts/HelveticaNeueMedium.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
    <StatusBar style="auto" />
    <SafeAreaView className="bg-black flex-1">
      <Stack screenOptions={{ animation: "none", contentStyle: { backgroundColor: "black" } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="bodyMetrics" options={{ headerShown: true, headerTitle: "" }} />
        <Stack.Screen name="foodlog" options={{ headerShown: false, headerTitle: "" }} />
        <Stack.Screen name="(training)/training" options={{ headerShown: false}} />
        <Stack.Screen name="(nutrition)/nutrition" options={{ headerShown: false}} />
        <Stack.Screen name="(more)/more" options={{ headerShown: false}} />
        <Stack.Screen name="(auth)" options={{ headerShown: false}} />
      </Stack>
      <BottomNavbar />
    </SafeAreaView>
    </>
  );
};

export default RootLayout;
