import { useEffect } from "react";
import { useMedia, ZStack } from "tamagui";
import { AppState, ImageBackground } from "react-native";

import { Redirect, Slot, usePathname, useRouter } from "expo-router";

import Toast from "react-native-toast-message";

import NetInfo from "@react-native-community/netinfo";

import toastConfig from "@constants/toastConfig";
import { StyledSafeAreaView } from "@components/general/StyledSafeAreaView";

import useAuth from "@hooks/useAuth";
import useLogger from "@hooks/useLogger";
import LoadingScreen from "@/src/pages/LoadingScreen";
import { toastVisibilityTime } from "@utils/toastHelper";
import { setOffline, setOnline } from "@/src/utils/utils";
import useBakalariStore from "@/src/hooks/useBakalariStore";
import { focusManager, onlineManager } from "@tanstack/react-query";

const { log } = useLogger("layout", "root");

export default function App() {
  const { setOnlineStatus, api } = useBakalariStore();
  const { data, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const media = useMedia();

  // Setting up fonts
  // const fontsLoaded = useMyFonts();

  useEffect(() => {
    log.space();
    NetInfo.addEventListener((state) => {
      if (!!state.isConnected) {
        setOnline();
      } else {
        setOffline();
      }
    });
    onlineManager.subscribe((isOnline) => {
      setOnlineStatus(isOnline);
    });

    AppState.addEventListener("change", (status) =>
      focusManager.setFocused(status === "active")
    );
  }, []);

  useEffect(() => {
    if (pathname.includes("login") || data !== "no-credentials") return;

    router.replace("/login");
  }, [data]);

  return (
    <StyledSafeAreaView>
      <ZStack flex={1} overflow="hidden">
        {!isLoading && (
          <ImageBackground
            source={
              media.landscape ? 0 : require("@images/Background-Login.png")
            }
            style={{ flex: 1 }}
          >
            {(!!api !== pathname.includes("login") ||
              (!api && data === "network-error")) && <Slot />}
          </ImageBackground>
        )}
        <LoadingScreen />
        <Toast
          visibilityTime={toastVisibilityTime}
          config={toastConfig}
          onPress={() => Toast.hide()}
          topOffset={0}
        />
      </ZStack>
    </StyledSafeAreaView>
  );
}
