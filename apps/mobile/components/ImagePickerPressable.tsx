import { Pressable, StyleSheet, Text, View, Modal } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import GenericButton from "./GenericButton";
import XIcon from "../assets/icons/XIcon";

export const ImagePickerPressable = ({
  children,
  setImageUri,
  setImage,
}: {
  children: React.ReactNode;
  setImageUri: React.Dispatch<React.SetStateAction<string | null>>;
  setImage: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset | null>
  >;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => {
          setVisible(true);
        }}
      >
        {children}
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-gray1 rounded-lg p-6 pt-4 shadow-lg">
            <Pressable
              onPress={() => setVisible(false)}
              className="flex-row items-center justify-end mb-3"
            >
              <XIcon height={25} width={25} fill="white" />
            </Pressable>
            <Text className="text-lg text-center mb-6 text-white">
              Choose How to Upload Image
            </Text>
            <View className="flex-row gap-6 justify-center">
              <GenericButton
                className="w-24 h-14"
                text="From Camera"
                onPress={async () => {
                  const { status } =
                    await ImagePicker.requestCameraPermissionsAsync();
                  if (status !== "granted") {
                    alert("Camera permission required!");
                    return;
                  }

                  const result = await ImagePicker.launchCameraAsync({
                    mediaTypes: "images",
                    base64: true,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  });
                  if (result.assets && result.assets[0]) {
                    setImageUri(result.assets[0].uri);
                    setImage(result.assets[0]);
                  }
                  setVisible(false);
                }}
              />
              <GenericButton
                className="w-24 h-14"
                text="From Gallery"
                onPress={async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: "images",
                    base64: true,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  });

                  if (result.assets && result.assets[0]) {
                    setImageUri(result.assets[0].uri);
                    setImage(result.assets[0]);
                  }
                  setVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
