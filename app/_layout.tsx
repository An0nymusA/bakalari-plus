// import '@tamagui/core/reset.css'

import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";

import { useFonts } from "expo-font";
import { Slot } from "expo-router";

import config from "@/tamagui.config";
import { StyledSafeAreaView } from "@src/components/layout/StyledSafeAreaView";

export default function App() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    MontserratBold: require("@fonts/Montserrat-Bold.ttf"),
    MontserratMedium: require("@fonts/Montserrat-Medium.ttf"),
    MontserratRegular: require("@fonts/Montserrat-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={colorScheme === "dark" ? "dark" : "light"}>
        <StyledSafeAreaView backgroundColor="$grey100">
          <Slot />
        </StyledSafeAreaView>
      </Theme>
    </TamaguiProvider>
  );
}
