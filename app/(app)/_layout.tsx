// import '@tamagui/core/reset.css'

import { useEffect, useState } from "react";
import { TamaguiProvider, Text, Theme } from "tamagui";

import { useFonts } from "expo-font";
import { Redirect, Slot, usePathname } from "expo-router";

import Toast, { ToastConfigParams } from "react-native-toast-message";
import ErrorToast from "@components/toasts/ErrorToast";
import SuccessToast from "@components/toasts/SuccessToast";
import LoadingToast from "@components/toasts/LoadingToast";

import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import config from "@/tamagui.config";
import { StyledSafeAreaView } from "@components/general/StyledSafeAreaView";

import StorageWrapper from "@utils/storage";
import useAuth from "@hooks/useAuth";
import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@hooks/useLogger";
import queryClient, { asyncStoragePersister } from "@src/api/queryClient";
import LoadingScreen from "@/src/pages/LoadingScreen";

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

export default function App() {
  const { login } = useAuth();
  const { log } = useLogger("layout", "root");
  const { authStatus, api } = useBakalariStore();
  const [storageLoaded, setStorageLoaded] = useState(false);
  const pathname = usePathname();

  // Setting up fonts
  const [fontsLoaded] = useFonts({
    MontserratBold: require("@fonts/Montserrat-Bold.ttf"),
    MontserratMedium: require("@fonts/Montserrat-Medium.ttf"),
    MontserratRegular: require("@fonts/Montserrat-Regular.ttf"),
  });

  useEffect(() => {
    log.space();

    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      })
    );

    (async () => {
      setStorageLoaded(true);

      login(await StorageWrapper.get("loginData"));
    })();
  }, []);


  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <TamaguiProvider config={config}>
        {/* <Theme name={colorScheme === "dark" ? "dark" : "light"}> */}
        <Theme name={"dark"}>
          <StyledSafeAreaView backgroundColor="$background">
            <LoadingScreen />
            {storageLoaded && fontsLoaded && authStatus !== "pending" ? (
              authStatus.includes("error") && !pathname.includes("/login") ? (
                <Redirect href="/login" />
              ) : (
                <Slot />
              )
            ) : null}
            <Toast config={toastConfig} onPress={() => Toast.hide()} />
          </StyledSafeAreaView>
        </Theme>
      </TamaguiProvider>
    </PersistQueryClientProvider>
  );
}