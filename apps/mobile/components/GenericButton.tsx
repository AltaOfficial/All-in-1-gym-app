import { Pressable, Text, TouchableOpacity } from "react-native";

const GenericButton = ({
  text,
  onPress,
  icon,
  className,
  textClassName,
  opacityEnabled = true,
}: {
  text?: string;
  onPress: () => void;
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
  opacityEnabled?: boolean;
}) => {

  if(opacityEnabled) {
    return (
      <TouchableOpacity
        className={`bg-primary rounded-full p-4 w-44 ${className}`}
        onPress={onPress}
      >
        {icon}
        {text && (
          <Text className={`text-center font-[HelveticaNeue] text-white ${textClassName}`}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    );
  } else {
    return (
      <Pressable
        className={`bg-primary rounded-full p-4 w-44 ${className}`}
        onPress={onPress}
      >
        {icon}
        {text && (
          <Text className={`text-center font-[HelveticaNeue] text-white ${textClassName}`}>
            {text}
          </Text>
        )}
      </Pressable>
    );
  }
};

export default GenericButton;
