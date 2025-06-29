import { Pressable, Text } from "react-native";
import React from "react";

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
      className={`flex flex-row bg-white text-center rounded-[2rem] ${className}`}
    >
      {children}
      <Text className="text-black font-[HelveticaNeueMedium]">{text}</Text>
    </Pressable>
  );
};

export default LogInWithButton;
