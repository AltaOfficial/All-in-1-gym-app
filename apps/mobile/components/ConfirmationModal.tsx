import { StyleSheet, Text, View, Modal } from "react-native";
import GenericButton from "./GenericButton";

const ConfirmationModal = ({
  visible,
  setVisible,
  onYes,
  text,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onYes: () => void;
  text: string;
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-gray1 rounded-lg p-6 shadow-lg">
          <Text className="text-lg text-center mb-6 text-white">{text}</Text>
          <View className="flex-row gap-6 justify-center">
            <GenericButton className="!w-24 h-14" text="Yes" onPress={onYes} />
            <GenericButton
              className="!w-24 h-14"
              text="No"
              onPress={() => {
                setVisible(false);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({});
