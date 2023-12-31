// import '@tamagui/core/reset.css'

import { useEffect, useState } from "react";
import { TamaguiProvider, Theme, useMedia } from "tamagui";
import { StatusBar, ImageBackground } from "react-native";

import { useFonts } from "expo-font";
import { Redirect, Slot, usePathname, useRouter } from "expo-router";

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
import colors from "@/src/constants/colors";

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

const { log } = useLogger("layout", "root");

export default function App() {
  const { login } = useAuth();
  const { authStatus, api } = useBakalariStore();
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [hasAuthData, setHasAuthData] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const media = useMedia();

  // Setting up fonts
  const [fontsLoaded] = useFonts({
    MontserratBold: require("@fonts/Montserrat-Bold.ttf"),
    MontserratMedium: require("@fonts/Montserrat-Medium.ttf"),
    MontserratRegular: require("@fonts/Montserrat-Regular.ttf"),
  });

  useEffect(() => {
    log.space();

    StatusBar.setBackgroundColor(colors.grey100);
    StatusBar.setBarStyle("light-content");

    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      })
    );

    (async () => {
      setStorageLoaded(true);

      const authData = await StorageWrapper.get("loginData");
      setHasAuthData(authData == null);

      login(await StorageWrapper.get("loginData"));
    })();
  }, []);

  useEffect(() => {
    if (pathname.includes("login")) return;

    if (authStatus.includes("no-credentials") || authStatus.includes("error")) {
      router.replace("/login");
      return;
    }
  }, [api, authStatus]);

  const everyThingLoaded =
    storageLoaded && fontsLoaded && (hasAuthData || authStatus !== "pending");

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <TamaguiProvider config={config}>
        <Theme name={"dark"}>
          <StyledSafeAreaView>
            <LoadingScreen />
            {everyThingLoaded ? (
              <ImageBackground
                source={
                  media.landscape ? 0 : require("@images/Background-Login.png")
                }
                style={{ flex: 1 }}
              >
                <Slot />
              </ImageBackground>
            ) : null}
            <Toast config={toastConfig} onPress={() => Toast.hide()} />
          </StyledSafeAreaView>
        </Theme>
      </TamaguiProvider>
    </PersistQueryClientProvider>
  );
}
