import { useEffect, useState } from "react";
import { AppState, ImageBackground } from "react-native";
import { focusManager, onlineManager } from "@tanstack/react-query";
import { useMedia, ZStack } from "tamagui";
import { Slot, usePathname, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";

import toastConfig from "@constants/toastConfig";
import { StyledSafeAreaView } from "@components/general/StyledSafeAreaView";

import useAuth from "@hooks/useAuth";
import useLogger from "@hooks/useLogger";
import useBakalariStore from "@hooks/useBakalariStore";
import LoadingScreen from "@/src/pages/LoadingScreen";
import { toastVisibilityTime } from "@utils/toastHelper";
import { setOffline, setOnline } from "@utils/utils";
import StorageWrapper from "@utils/storage";

const { log } = useLogger("layout", "root");

export default function App() {
  const { setOnlineStatus, api } = useBakalariStore();
  const [hasAuthData, setHasAuthData] = useState<null | boolean>(null);
  const { data, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const media = useMedia();

  useEffect(() => {
    log.space();

    StorageWrapper.get("loginData").then((data) => {
      setHasAuthData(data !== null);
    });

    onlineManager.setOnline(false);
    NetInfo.fetch().then((state) => {
      onlineManager.setOnline(state.isConnected === true);
      setOnlineStatus(state.isConnected === true);
    });

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
    if (api || pathname.includes("login") || data !== "no-credentials") return;

    router.replace("/login");
  }, [data]);

  const isLoaded = !isLoading || hasAuthData === true;

  return (
    <StyledSafeAreaView>
      <ZStack flex={1} overflow="hidden">
        {isLoaded && (
          <ImageBackground
            source={
              media.landscape ? 0 : require("@images/Background-Login.png")
            }
            style={{ flex: 1 }}
          >
            {(!!api !== pathname.includes("login") ||
              (!api && data === "error") ||
              hasAuthData === true) && <Slot />}
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
