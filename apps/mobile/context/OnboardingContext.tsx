import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

export enum OnboardingStepCategory {
  BasicInfo,
  Training,
  Nutrition,
  Goals,
}

export const OnboardingContext = createContext({
  onboardingStepCategory: OnboardingStepCategory.BasicInfo,
  setOnboardingStepCategory: (
    onboardingStepCategory: OnboardingStepCategory
  ) => {},
});

export const OnboardingStepLabels = {
  [OnboardingStepCategory.BasicInfo]: "Basic Info",
  [OnboardingStepCategory.Training]: "Training",
  [OnboardingStepCategory.Nutrition]: "Nutrition",
  [OnboardingStepCategory.Goals]: "Goals",
};

export function OnboardingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [onboardingStepCategory, setOnboardingStepCategory] = useState(
    OnboardingStepCategory.BasicInfo
  );

  return (
    <OnboardingContext.Provider
      value={{ onboardingStepCategory, setOnboardingStepCategory }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export async function checkAccountNeedsOnboarding(
  account: any,
  setOnboardingStepCategory: (
    onboardingStepCategory: OnboardingStepCategory
  ) => void,
  redirectToOnboarding: boolean
) {
  // this shoudlnt be hardcoded, but for mvp purposes it is
  if (redirectToOnboarding) {
    switch (account.onBoardingStep) {
      case 1:
        setOnboardingStepCategory(OnboardingStepCategory.BasicInfo);
        router.push("/(loginFlow)/(onboardingFlow)/ageFlow");
        break;
      case 2:
        setOnboardingStepCategory(OnboardingStepCategory.BasicInfo);
        router.push("/(loginFlow)/(onboardingFlow)/weightFlow");
        break;
      case 3:
        setOnboardingStepCategory(OnboardingStepCategory.BasicInfo);
        router.push("/(loginFlow)/(onboardingFlow)/heightFlow");
        break;
      case 4:
        setOnboardingStepCategory(OnboardingStepCategory.BasicInfo);
        router.push("/(loginFlow)/(onboardingFlow)/genderFlow");
        break;
      case 5:
        setOnboardingStepCategory(OnboardingStepCategory.Training);
        router.push("/(loginFlow)/(onboardingFlow)/trainingExperienceFlow");
        break;
      case 6:
        setOnboardingStepCategory(OnboardingStepCategory.Goals);
        router.push("/(loginFlow)/(onboardingFlow)/mainGoalFlow");
        break;
      case 7:
        setOnboardingStepCategory(OnboardingStepCategory.Goals);
        router.push("/(loginFlow)/(onboardingFlow)/weeklyWeightChangeFlow");
        break;
    }
  } else if (account.onBoardingStep > 0) {
    return true;
  } else {
    return false;
  }
}
