import { ImageBackground } from "react-native";
import { useEffect } from "react";

import { Slot, Redirect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@/src/hooks/useLogger";

export default function App() {
  const { api } = useBakalariStore();
  const { log } = useLogger("layout", "login");

  log.navigation("opened");
  log.info(`loginAPI ${api == null ? "null" : "ready"}`)

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Redirect to timetable if API is ready
  if (api) return <Redirect href="/modules/timetable" />;

  return (
    <ImageBackground
      source={require("@images/Background-Login.png")}
      style={{ flex: 1 }}
    >
      <Slot />
    </ImageBackground>
  );
}
