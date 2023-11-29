// import '@tamagui/core/reset.css'

import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";

import { useFonts } from "expo-font";
import { Slot } from "expo-router";

import Toast, { ToastConfigParams } from "react-native-toast-message";
import ErrorToast from "@components/toasts/ErrorToast";
import SuccessToast from "@components/toasts/SuccessToast";
import LoadingToast from "@components/toasts/LoadingToast";

import NetInfo from "@react-native-community/netinfo";
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import config from "@/tamagui.config";
import { StyledSafeAreaView } from "@src/components/layout/StyledSafeAreaView";

const queryClient = new QueryClient();

const toastConfig = {
  success: ({ text1 }: ToastConfigParams<any>) => (
    <SuccessToast text={text1 || ""} />
  ),
  error: ({ text1 }: ToastConfigParams<any>) => (
    <ErrorToast text={text1 || ""} />
  ),
  loading: ({ text1 }: ToastConfigParams<any>) => (
    <LoadingToast text={text1 || ""} />
  ),
};

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

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <Theme name={colorScheme === "dark" ? "dark" : "light"}>
          <StyledSafeAreaView backgroundColor="$grey100">
            <Slot />
            <Toast
              config={toastConfig}
              onPress={() => Toast.hide()}
            />
          </StyledSafeAreaView>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
