// import '@tamagui/core/reset.css'

import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";

import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";

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
import { StyledSafeAreaView } from "@/src/components/general/StyledSafeAreaView";

import StorageWrapper from "@/src/utils/storage";
import { useAuth } from "@/src/hooks/useAuth";
import useBakalariStore from "@/src/utils/useBakalariStore";

const queryClient = new QueryClient();

/**
 * Setting up toasts
 */
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

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();

  const { login } = useAuth();
  const { authStatus } = useBakalariStore();
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Setting up fonts
  const [fontsLoaded] = useFonts({
    MontserratBold: require("@fonts/Montserrat-Bold.ttf"),
    MontserratMedium: require("@fonts/Montserrat-Medium.ttf"),
    MontserratRegular: require("@fonts/Montserrat-Regular.ttf"),
  });

  useEffect(() => {
    (async () => {
      // Loading storage
      await StorageWrapper.init();
      setStorageLoaded(true);

      await login(StorageWrapper.get("loginData"));
      SplashScreen.hideAsync();
    })();
  }, []);

  if (!(storageLoaded && fontsLoaded && authStatus !== "pending")) {
    return null;
  }

  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <Theme name={colorScheme === "dark" ? "dark" : "light"}>
          <StyledSafeAreaView backgroundColor="$background">
            <Slot />
            <Toast config={toastConfig} onPress={() => Toast.hide()} />
          </StyledSafeAreaView>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
