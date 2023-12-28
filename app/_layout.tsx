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
import { onlineManager, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import config from "@/tamagui.config";
import { StyledSafeAreaView } from "@/src/components/general/StyledSafeAreaView";

import StorageWrapper from "@/src/utils/storage";
import { useAuth } from "@/src/hooks/useAuth";
import useBakalariStore from "@/src/utils/useBakalariStore";
import createStoragePersister from "@/src/utils/StoragePersister";
import useLogger from "@/src/hooks/useLogger";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchInterval: 2 * 60 * 1000, // 2 minutes
      gcTime: Infinity,
    },
  },
});

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
  const { log } = useLogger("layout", "root");
  const { authStatus } = useBakalariStore();
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Setting up fonts
  const [fontsLoaded] = useFonts({
    MontserratBold: require("@fonts/Montserrat-Bold.ttf"),
    MontserratMedium: require("@fonts/Montserrat-Medium.ttf"),
    MontserratRegular: require("@fonts/Montserrat-Regular.ttf"),
  });

  useEffect(() => {

    log.space();

    (async () => {
      // Loading storage
      await StorageWrapper.init();
      setStorageLoaded(true);

      login(StorageWrapper.get("loginData"));
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
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: createStoragePersister() }}
    >
      <TamaguiProvider config={config}>
        <Theme name={colorScheme === "dark" ? "dark" : "light"}>
          <StyledSafeAreaView backgroundColor="$background">
            <Slot />
            <Toast config={toastConfig} onPress={() => Toast.hide()} />
          </StyledSafeAreaView>
        </Theme>
      </TamaguiProvider>
    </PersistQueryClientProvider>
  );
}
