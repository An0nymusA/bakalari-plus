import { useEffect, useState } from "react";

import { Slot, SplashScreen } from "expo-router";
import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@hooks/useLogger";

import { View } from "tamagui";
import Backdrop from "@/src/components/menu/MenuBackdrop";
import StaticMenu from "@/src/components/menu/StaticMenu";

import useApi from "@/src/hooks/useApi";

const { log } = useLogger("layout", "modules");

export default function App() {
  const { setLoaderVisible } = useBakalariStore();

  useEffect(() => {
    log.navigation("opened");
    setLoaderVisible(true);

    SplashScreen.hideAsync();
  }, []);

  const isFetching = useApi();

  useEffect(() => {
    setLoaderVisible(isFetching);
  }, [isFetching]);

  return isFetching ? null : (
    <>
      <View flex={1}>
        <Slot />
        <Backdrop />
      </View>
      <StaticMenu />
    </>
  );
}
