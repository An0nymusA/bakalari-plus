import { ImageBackground } from "react-native";
import { useEffect } from "react";

import { Redirect, Slot } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@hooks/useLogger";

import { View } from "tamagui";
import Backdrop from "@/src/components/general/MenuBackdrop";
import StaticMenu from "@/src/components/general/StaticMenu";

export default function App() {
  const { api } = useBakalariStore();
  const { log } = useLogger("layout", "modules");
  log("opened");

  // Redirect to login if API is not ready
  // if (!api) return <Redirect href="/login" />;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
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
