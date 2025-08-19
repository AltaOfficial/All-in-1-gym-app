import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useContext, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import { AuthContextProvider, AuthContext } from "../context/AuthContext";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
            await fetch("http://192.168.55.212:8000/auth/validate", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => {
                if (res.ok) {
                  return res.json();
                }
                throw new Error("Invalid token");
              })
              .then((data) => {
                SecureStore.setItemAsync("jwtToken", data.token);
                setIsSignedIn(true);
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
      <Stack>
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen
            name="(loginFlow)/usernameFlow"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(loginFlow)/passwordFlow"
            options={{ headerShown: false }}
          />
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
