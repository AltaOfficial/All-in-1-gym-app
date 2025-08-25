import { Text, Pressable } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function More() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      <Pressable
        className="text-white font-[HelveticaNeue]"
        onPress={() => {
          setIsSignedIn(false);
          SecureStore.deleteItemAsync("jwtToken");
          router.push("/(loginFlow)/usernameFlow");
        }}
      >
        <Text className="text-white font-[HelveticaNeue]">signout</Text>
      </Pressable>
    </SafeAreaView>
  );
}
