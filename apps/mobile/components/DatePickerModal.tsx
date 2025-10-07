import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onDateChange,
}) => {
  const [tempDate, setTempDate] = useState(selectedDate);

  const handleConfirm = () => {
    onDateChange(tempDate);
    onClose();
  };

  const handleCancel = () => {
    setTempDate(selectedDate);
    onClose();
  };

  const onChangeInternal = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && date) {
        onDateChange(date);
      }
    } else {
      if (date) {
        setTempDate(date);
      }
    }
  };

  // On Android, just show the native picker directly
  if (Platform.OS === "android" && visible) {
    return (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={(event, date) => {
          onClose();
          if (event.type === "set" && date) {
            onDateChange(date);
          }
        }}
        maximumDate={new Date()}
      />
    );
  }

  // On iOS, show the modal
  if (Platform.OS === "ios") {
    return (
      <Modal visible={visible} transparent onRequestClose={handleCancel}>
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={handleCancel}
        >
          <Pressable
            className="bg-gray1 rounded-t-3xl"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray2">
              <TouchableOpacity onPress={handleCancel}>
                <Text className="text-primary text-lg font-[HelveticaNeue]">
                  Cancel
                </Text>
              </TouchableOpacity>
              <Text className="text-white text-lg font-[HelveticaNeue] font-bold">
                Select Date
              </Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text className="text-primary text-lg font-[HelveticaNeue] font-bold">
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <View className="py-4">
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={onChangeInternal}
                textColor="#ffffff"
                maximumDate={new Date()}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  return null;
};

export default DatePickerModal;
