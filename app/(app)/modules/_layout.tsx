import { ImageBackground } from "react-native";
import { useEffect } from "react";

import { Slot, SplashScreen } from "expo-router";
import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@hooks/useLogger";

import { View } from "tamagui";
import Backdrop from "@components/general/MenuBackdrop";
import StaticMenu from "@components/general/StaticMenu";

import useApi from "@/src/api/useApi";

export default function App() {
  const { log } = useLogger("layout", "modules");
  const { setLoaderVisible } = useBakalariStore();

  useEffect(() => {
    log.navigation("opened");
    setLoaderVisible(true);
    
    SplashScreen.hideAsync();
  }, []);

  const isLoading = useApi(log);

  useEffect(() => {
    setLoaderVisible(isLoading);
  }, [isLoading]);

  return isLoading ? null : (
    <ImageBackground
      source={require("@images/Background-global.svg")}
      style={{ flex: 1 }}
    >
      <View flex={1}>
        <Slot />

        <Backdrop />
      </View>
      <StaticMenu />
    </ImageBackground>
  );
}
