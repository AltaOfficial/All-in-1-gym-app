import { Stack } from "expo-router";
import { useState } from "react";

export default function _layout() {

    const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);
  return (
    <Stack>
        <Stack.Protected guard={false}>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={true}>
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        </Stack.Protected>
    </Stack>
  )
}