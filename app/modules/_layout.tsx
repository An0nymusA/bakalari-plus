import { ImageBackground } from "react-native";
import { useEffect } from "react";

import { Slot, Redirect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@hooks/useLogger";

import { View } from "tamagui";
import Backdrop from "@/src/components/general/MenuBackdrop";
import StaticMenu from "@/src/components/general/StaticMenu";

import { useQueries } from "@tanstack/react-query";
import {
  formatMarks,
  formatTimetable,
} from "bakalari-ts-api/build/utils/formattingUtils";

export default function App() {
  const { api } = useBakalariStore();
  const { log } = useLogger("layout", "modules");
  log.navigation("opened");

  if (!api) return <Redirect href="/login" />;

  const data = useQueries({
    queries: [
      {
        queryKey: ["marks"],
        queryFn: () => {
          log.debug("fetching marks");

          return api?.marks().then((data) => {
            log.debug("fetching marks done");
            return formatMarks(data);
          });
        },
      },
      {
        queryKey: ["timetable", "permanent"],
        queryFn: () => {
          log.debug("fetching timetable", "permanent");

          return api?.timetable({ type: "permanent" }).then((data) => {
            log.debug("fetching timetable done", "permanent");
            return formatTimetable(data);
          });
        },
      },
      {
        queryKey: ["timetable", "actual"],
        queryFn: () => {
          log.debug("fetching timetable", "actual");

          return api?.timetable({ type: "actual" }).then((data) => {
            log.debug("fetching timetable done", "actual");
            return formatTimetable(data);
          });
        },
      },
    ],
  });
  const isLoading = data.some((query) => query.isLoading);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  if (isLoading) return null;

  return (
    <ImageBackground
      source={require("@images/Background-global.svg")}
      style={{ flex: 1 }}
    >
      <View flex={1}>
        <Slot />

        <Backdrop />
      </View>
      <StaticMenu />
    </ImageBackground>
  );
}
