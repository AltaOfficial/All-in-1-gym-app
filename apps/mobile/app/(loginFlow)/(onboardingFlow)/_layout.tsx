import { Stack } from "expo-router";
import OnboardingNavigationBar from "../../../components/OnboardingNavigationBar";
import { OnboardingContextProvider } from "../../../context/OnboardingContext";

export default function OnboardingLayout() {
  return (
    <OnboardingLayoutContainer>
      <OnboardingNavigationBar />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="summary" options={{ headerShown: false }} />
      </Stack>
    </OnboardingLayoutContainer>
  );
}

function OnboardingLayoutContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingContextProvider>{children}</OnboardingContextProvider>;
}
