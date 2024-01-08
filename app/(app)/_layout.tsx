// import '@tamagui/core/reset.css'

import { useEffect } from "react";
import { useMedia } from "tamagui";
import { ImageBackground } from "react-native";

import { Slot, usePathname, useRouter } from "expo-router";

import Toast from "react-native-toast-message";

import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

import toastConfig from "@constants/toastConfig";
import { StyledSafeAreaView } from "@components/general/StyledSafeAreaView";

import useAuth from "@hooks/useAuth";
import useLogger from "@hooks/useLogger";
import useMyFonts from "@hooks/useMyFonts";
import LoadingScreen from "@/src/pages/LoadingScreen";
import { toastVisibilityTime } from "@utils/toastHelper";

const { log } = useLogger("layout", "root");

export default function App() {
  const { data, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const media = useMedia();

  // Setting up fonts
  const fontsLoaded = useMyFonts();

  useEffect(() => {
    log.space();

    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      })
    );
  }, []);

  useEffect(() => {
    if (pathname.includes("login") || data !== "no-credentials") return;

    router.replace("/login");
  }, [data]);

  const everyThingLoaded = fontsLoaded && !isLoading;

  return (
    <StyledSafeAreaView>
      <LoadingScreen />
      {everyThingLoaded && (
        <ImageBackground
          source={media.landscape ? 0 : require("@images/Background-Login.png")}
          style={{ flex: 1 }}
        >
          <Slot />
        </ImageBackground>
      )}
      <Toast
        visibilityTime={toastVisibilityTime}
        config={toastConfig}
        onPress={() => Toast.hide()}
      />
    </StyledSafeAreaView>
  );
}
