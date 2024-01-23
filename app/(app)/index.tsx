import { Redirect } from "expo-router";
import useLogger from "@hooks/useLogger";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

import { useMedia } from "tamagui";

const { log } = useLogger("index", "root");

export default function Page() {
  const media = useMedia();

  useEffect(() => {
    log.navigation("opened");

    if (media.xs) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return <Redirect href="/modules/timetable" />;
}
