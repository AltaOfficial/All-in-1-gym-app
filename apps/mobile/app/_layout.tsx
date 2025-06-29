import { useColorScheme, View } from "react-native";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
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

  return <Slot />;
};

export default RootLayout;
