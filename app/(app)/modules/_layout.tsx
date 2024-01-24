import { useDeferredValue, useEffect, useState } from "react";
import { Slot, SplashScreen } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { View } from "tamagui";

import useBakalariStore from "@/src/hooks/useBakalariStore";
import useLogger from "@hooks/useLogger";
import useApi from "@hooks/useApi";
import Backdrop from "@components/menu/MenuBackdrop";
import StaticMenu from "@components/menu/StaticMenu";

const { log } = useLogger("layout", "modules");

export default function App() {
  const { setLoaderVisible } = useBakalariStore();
  const [firstFetch, setFirstFetch] = useState(true);

  useEffect(() => {
    log.navigation("opened");
    setLoaderVisible(true);

    ScreenOrientation.unlockAsync();
    SplashScreen.hideAsync();
  }, []);

  const isFetching = useDeferredValue(useApi());

  useEffect(() => {
    if (!firstFetch) return;

    setLoaderVisible(isFetching);

    if (firstFetch && !isFetching) {
      setFirstFetch(false);
      setLoaderVisible(false);
    }
  }, [isFetching]);

  return (
    !(firstFetch && isFetching) && (
      <>
        <View flex={1}>
          <Slot />
          <Backdrop />
        </View>
        <StaticMenu />
      </>
    )
  );
}
