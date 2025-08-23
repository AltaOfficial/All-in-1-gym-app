import { router, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useContext, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import { AuthContextProvider, AuthContext } from "../context/AuthContext";
import { Pressable, Text } from "react-native";
import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
import {
  checkAccountNeedsOnboarding,
  OnboardingContext,
} from "../context/OnboardingContext";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setOnboardingStepCategory } = useContext(OnboardingContext);
  const [loaded, error] = useFonts({
    HelveticaNeue: require("../assets/fonts/HelveticaNeueRoman.otf"),
    HelveticaNeueBoldItalic: require("../assets/fonts/HelveticaNeueBoldItalic.otf"),
    HelveticaNeueMedium: require("../assets/fonts/HelveticaNeueMedium.otf"),
  });

  if (!loaded && !error) {
    return null; // Keep splash screen visible while fonts are loading
  }

  function RootNavigator() {
    const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

    useEffect(() => {
      if (loaded || error) {
        (async () => {
          let token = await SecureStore.getItemAsync("jwtToken");
          if (token) {
            await fetch(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/validate`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then((res) => {
                if (res.ok) {
                  return res.json();
                }
                throw new Error("Invalid token");
              })
              .then(async (data) => {
                let needsOnboarding = await checkAccountNeedsOnboarding(
                  data.user,
                  setOnboardingStepCategory,
                  false
                );
                if (!needsOnboarding) {
                  SecureStore.setItemAsync("jwtToken", data.token);
                  setIsSignedIn(true);
                }
                if (__DEV__) {
                  setTimeout(() => {
                    // need to wait for next render for signedIn to be set to true
                    SplashScreen.hideAsync();
                  }, 500);
                } else {
                  SplashScreen.hideAsync();
                }
              })
              .catch((err) => {
                console.log(err);
                setIsSignedIn(false);
                SplashScreen.hideAsync();
              });
          } else {
            setIsSignedIn(false);
            SplashScreen.hideAsync();
          }
        })();
      }
    }, [loaded, error, setIsSignedIn]);

    return (
      <Stack
        screenOptions={{
          headerStyle: {
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
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen
            name="(loginFlow)/usernameFlow"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(loginFlow)/passwordFlow" />
        </Stack.Protected>
      </Stack>
    );
  }

  return (
    <AuthContextProvider>
      <RootNavigator />
    </AuthContextProvider>
  );
}
