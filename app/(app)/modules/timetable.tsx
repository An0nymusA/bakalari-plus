import { useEffect, useState } from "react";
import { View, Text } from "tamagui";

import { useQuery } from "@tanstack/react-query";

import useApiRequests from "@hooks/useApiEndpoints";
import useBakalariStore from "@utils/useBakalariStore";

import useLogger from "@hooks/useLogger";
import PageMenu from "@components/menu/PageMenu";
import Timetable from "@components/modules/Timetable";
import { getMondayDate, getWeekNumber } from "@utils/utils";
import { Empty } from "@src/assets/images";

const { log } = useLogger("timetable", "modules");

export default function Page() {
  const { api, setLoaderVisible } = useBakalariStore();
  const ApiRequests = useApiRequests(api);

  const [dateModifier, setDateModifier] = useState(0);
  const date = getMondayDate(dateModifier);

  const [type, setType] = useState<"actual" | "permanent">("actual");

  const { data, isFetching } = useQuery(ApiRequests.timetable({ type, date }));

  useEffect(() => {
    log.navigation("opened");

    return () => {
      setLoaderVisible(false);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setLoaderVisible(false);
      return;
    }

    setLoaderVisible(isFetching ? "simple" : false);
  }, [isFetching]);

  return (
    <View flex={1}>
      <View flex={1}>
        {data == null ? (
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
              setType("actual");
              setDateModifier((current) => --current);
            },
            text: "Předchozí",
            disabled: dateModifier < 0 && Math.abs(dateModifier) >= 2,
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
              setType("actual");
              setDateModifier((current) => ++current);
            },
            text: "Další",
            disabled: dateModifier > 0 && Math.abs(dateModifier) >= 2,
          },
        ]}
      />
    </View>
  );
}

const NoData = ({ showNoData }: { showNoData: boolean }) => {
  if (!showNoData) return;

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Empty width={100} height={100} />
    </View>
  );
};

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
      case -2:
        return "2 týdny zpět";
      case -1:
        return "Minulý týden";
      case 0:
        return "Tento týden";
      case 1:
        return "Příští týden";
      case 2:
        return "2 týdny dopředu";
    }
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
      alignItems="center"
    >
      <Text
        color={"$grey40"}
        backgroundColor={"$transparent"}
        paddingHorizontal="$2"
        paddingVertical="$1"
        borderRadius={"$1"}
        marginBottom="$2"
      >
        {type == "actual" ? humanize(weekNumber) : "Stálý rozvrh"}
      </Text>
    </View>
  );
};
