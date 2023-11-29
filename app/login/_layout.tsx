import { ImageBackground } from "react-native";
import { useEffect } from "react";

import { Slot } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

export default function App() {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <ImageBackground
      source={require("@images/Background-Login.png")}
      style={{ flex: 1 }}
    >
      <Slot />
    </ImageBackground>
  );
}
