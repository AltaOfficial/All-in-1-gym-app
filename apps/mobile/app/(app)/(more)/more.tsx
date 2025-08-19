import { View, Text, Pressable } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import * as SecureStore from "expo-secure-store";

export default function More() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

  return (
    <View>
      <Pressable
        className="text-white font-[HelveticaNeue]"
        onPress={() => {
          setIsSignedIn(false);
          SecureStore.deleteItemAsync("jwtToken");
        }}
      >
        <Text className="text-white font-[HelveticaNeue]">signout</Text>
      </Pressable>
    </View>
  );
}
