import { useEffect, useState } from "react";

import { Slot, SplashScreen } from "expo-router";
import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@hooks/useLogger";

import { View } from "tamagui";
import Backdrop from "@components/general/MenuBackdrop";
import StaticMenu from "@components/general/StaticMenu";

import useApi from "@/src/api/useApi";

export default function App() {
  const { log } = useLogger("layout", "modules");
  const { setLoaderVisible } = useBakalariStore();
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    log.navigation("opened");
    setLoaderVisible(true);

    SplashScreen.hideAsync();
  }, []);

  const isLoading = useApi();

  useEffect(() => {
    setLoaderVisible(firstLoad && isLoading);

    if (!isLoading && firstLoad) {
      setFirstLoad(false);
    }
  }, [isLoading]);

  return isLoading ? null : (
    <>
      <View flex={1}>
        <Slot />
        <Backdrop />
      </View>
      <StaticMenu />
    </>
  );
}
