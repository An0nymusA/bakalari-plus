import { Redirect } from "expo-router";
import useLogger from "@/src/hooks/useLogger";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

export default function Page() {
  const { log } = useLogger("index", "root");
  
  useEffect(() => {
    log.navigation("opened");
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return <Redirect href="/modules/timetable" />;
}
