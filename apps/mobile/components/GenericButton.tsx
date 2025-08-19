import { View, Text, Pressable } from "react-native";

const GenericButton = ({
  text,
  onPress,
  icon,
  className,
}: {
  text?: string;
  onPress: () => void;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Pressable
      className={`bg-primary rounded-full p-4 w-44 ${className}`}
      onPress={onPress}
    >
      {icon}
      {text && (
        <Text className="text-white text-center font-[HelveticaNeue]">
          {text}
        </Text>
      )}
    </Pressable>
  );
};

export default GenericButton;
