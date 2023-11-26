import { ImageBackground } from "react-native";

import { Slot } from "expo-router";

export default function App() {
  return (
    <ImageBackground
      source={require("@images/Background-Login.png")}
      style={{ flex: 1 }}
    >
      <Slot />
    </ImageBackground>
  );
}
