import { ImageBackground } from "react-native";
import { useEffect } from "react";

import { Redirect, Slot } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import useBakalariStore from "@/src/utils/useBakalariStore";
import useLogger from "@/src/hooks/useLogger";

export default function App() {
  const { api } = useBakalariStore();
  const { log } = useLogger("layout", "modules");
  log("opened");

  if (!api) {
    return <Redirect href="/login" />;
  }

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
      <Slot />
    </ImageBackground>
  );
}
