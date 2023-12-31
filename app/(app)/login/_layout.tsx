import { ImageBackground } from "react-native";

import { Slot, Redirect } from "expo-router";

import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@/src/hooks/useLogger";
import { useEffect } from "react";

const { log } = useLogger("layout", "login");

export default function App() {
  const { api } = useBakalariStore();

  useEffect(() => {
    log.navigation("opened");
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
