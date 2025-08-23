import { View, Text, Pressable } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function More() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

  return (
    <View>
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
    </View>
  );
}
