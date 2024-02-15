import { useEffect, useState } from "react";
import { Text, View } from "tamagui";

import { onlineManager, useQuery } from "@tanstack/react-query";

import PageMenu from "@components/menu/PageMenu";
import NoData from "@components/modules/NoData";
import Timetable from "@components/modules/Timetable";
import TimetableModal from "@components/modules/TimetableModal";
import { isInCache } from "@hooks/useApi";
import useApiEndpoints from "@hooks/useApiEndpoints";
import useBakalariStore from "@hooks/useBakalariStore";
import useLogger from "@hooks/useLogger";
import useTimetableModalStore from "@hooks/useTimetableModalStore";
import { getMondayDate } from "@utils/utils";

const { log } = useLogger("timetable", "modules");

export default function Page() {
  const { setLoaderVisible } = useBakalariStore();
  const { clearCurrent } = useTimetableModalStore();
  const ApiRequests = useApiEndpoints();

  // Args for timetable query
  const [dateModifier, setDateModifier] = useState(0);
  const date = getMondayDate(dateModifier);

  const [type, setType] = useState<"actual" | "permanent">("actual");
  const { data, isFetching } = useQuery(ApiRequests.timetable({ type, date }));

  useEffect(() => {
    log.navigation("opened");

    return () => {
      setLoaderVisible(false);
      clearCurrent();
    };
  }, []);

  useEffect(() => {
    clearCurrent();
  }, [type, dateModifier]);

  useEffect(() => {
    setLoaderVisible(data == null && isFetching ? "simple" : false);
  }, [isFetching, data]);

  return (
    <View flex={1}>
      <View flex={1}>
        {data == null ||
        Object.values(data.Days).some((day) => day.DayInfo == null) ? (
          <NoData showNoData={!isFetching} />
        ) : (
          <Timetable
            data={data}
            /*weekNumber={getWeekNumber(new Date(date))}*/ type={type}
          />
        )}
        <WeekPill weekNumber={dateModifier} type={type} />
      </View>
      <PageMenu
        buttons={[
          {
            onPress: () => {
              const inCache = isInCache(
                "module",
                "timetable",
                getMondayDate(dateModifier - 1)
              );

              if (!inCache && !onlineManager.isOnline()) {
                return;
              }

              setLoaderVisible(inCache ? false : "simple");

              setType("actual");
              setDateModifier((current) => --current);
            },
            text: "Předchozí",
          },
          {
            onPress: () => {
              setDateModifier(0);

              setType((current) => {
                const newType = current === "actual" ? "permanent" : "actual";

                return newType;
              });
            },
            text: type === "actual" ? "Stálý" : "Aktuální",
          },
          {
            onPress: () => {
              const inCache = isInCache(
                "module",
                "timetable",
                getMondayDate(dateModifier + 1)
              );

              if (!inCache && !onlineManager.isOnline()) {
                return;
              }

              setLoaderVisible(inCache ? false : "simple");

              setType("actual");
              setDateModifier((current) => ++current);
            },
            text: "Další",
          },
        ]}
      />
      <TimetableModal />
    </View>
  );
}

const WeekPill = ({
  weekNumber,
  type,
}: {
  weekNumber: number;
  type: "actual" | "permanent";
}) => {
  // Weeknumber could be from -2 to 2 where 0 is current
  const humanize = (weekNumber: number) => {
    switch (weekNumber) {
      case -1:
        return "Minulý týden";
      case 0:
        return "Tento týden";
      case 1:
        return "Příští týden";
    }

    // Localized order and weeke strings
    const weekStr = Math.abs(weekNumber) >= 5 ? "týdnů" : "týdny";
    const directionStr = weekNumber < 0 ? "zpět" : "dopředu";

    return `${Math.abs(weekNumber)} ${weekStr} ${directionStr}`;
  };

  return (
    <View
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      display="flex"
      justifyContent="flex-end"
      alignItems="flex-end"
    >
      <Text
        color={"$grey40"}
        backgroundColor={"$transparent"}
        paddingHorizontal="$2"
        paddingVertical="$1"
        borderRadius={"$1"}
        margin="$2"
        $gtSm={{
          fontSize: "$2",
          paddingHorizontal: "$2.5",
          paddingVertical: "$1.5",
        }}
      >
        {type == "actual" ? humanize(weekNumber) : "Stálý rozvrh"}
      </Text>
    </View>
  );
};
