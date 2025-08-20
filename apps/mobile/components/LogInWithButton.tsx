import { Pressable, Text } from "react-native";

const LogInWithButton = ({
  children,
  className,
  text,
}: {
  children?: React.ReactNode;
  className?: string;
  text?: string;
}) => {
  return (
    <Pressable
      className={`flex flex-row gap-6 bg-white justify-center rounded-[2rem] py-3 w-96 ${className}`}
    >
      {children}
      <Text className="text-black font-[HelveticaNeueMedium] text-center self-center">
        {text}
      </Text>
    </Pressable>
  );
};

export default LogInWithButton;
