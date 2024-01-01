import { useEffect } from "react";

import { Slot } from "expo-router";

import useLogger from "@/src/hooks/useLogger";

const { log } = useLogger("layout", "login");

export default function App() {
  useEffect(() => {
    log.navigation("opened");
  }, []);

  return <Slot />;
}
