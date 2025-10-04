import { Text, Pressable, View } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function More() {
  const { setIsSignedIn } = useContext(AuthContext);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center gap-6">
        <Pressable
          className="w-64 py-4 px-6 bg-gray2 rounded-2xl"
          onPress={() => {
            router.push("/(app)/(more)/settings");
          }}
        >
          <Text className="text-white font-[HelveticaNeue] text-lg text-center">Settings</Text>
        </Pressable>

        <Pressable
          className="w-64 py-4 px-6 bg-gray2 rounded-2xl"
          onPress={() => {
            setIsSignedIn(false);
            SecureStore.deleteItemAsync("jwtToken");
            router.push("/(loginFlow)/usernameFlow");
          }}
        >
          <Text className="text-white font-[HelveticaNeue] text-lg text-center">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
