import { Slot } from "expo-router";
import { useEffect } from "react";

import useLogger from "@hooks/useLogger";

const { log } = useLogger("layout", "login");

export default function App() {
  useEffect(() => {
    log.navigation("opened");
  }, []);

  return <Slot />;
}
