"use client";

import { Text, View } from "react-native";
import {
  OnboardingContext,
  OnboardingStepLabels,
} from "../context/OnboardingContext";
import { useContext } from "react";
import Svg, { Path } from "react-native-svg";

const OnboardingNavigationBar = () => {
  const { onboardingStepCategory } = useContext(OnboardingContext);

  return (
    <View
      className={`flex-row justify-between gap-2 px-4 bg-black ${onboardingStepCategory === 3 ? "!justify-end" : ""}`}
    >
      {Object.values(OnboardingStepLabels).map((label, index) => (
        <View
          key={index}
          className={`flex-row items-center px-4 py-2 ${
            index < onboardingStepCategory
              ? "bg-[#2D2D2D]/30"
              : index === onboardingStepCategory
                ? "bg-primary/30"
                : "bg-black/10" // nativewind bug with rounded-full, need to have a bg on load
          }`}
          style={{
            borderRadius: 100,
          }}
        >
          <Text
            key={index}
            className={`text-sm text-white ${
              onboardingStepCategory === index
                ? "!text-primary"
                : index < onboardingStepCategory
                  ? "!text-[#828282]"
                  : "!text-white"
            }`}
          >
            {label}{" "}
            {onboardingStepCategory === index
              ? `${index + 1}/${Object.values(OnboardingStepLabels).length}`
              : ""}
          </Text>
          {index < onboardingStepCategory && (
            <Svg width="15" height="15" viewBox="0 5 15 15" fill="none">
              <Path
                d="M1 12.5l3.5 3.5 6-6.5"
                stroke="#828282"
                strokeWidth={1.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>
      ))}
    </View>
  );
};

export default OnboardingNavigationBar;
