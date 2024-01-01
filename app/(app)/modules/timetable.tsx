import { useEffect, useState } from "react";
import { View, Text } from "tamagui";

import { useQuery } from "@tanstack/react-query";

import useApiRequests from "@/src/hooks/useApiEndpoints";
import useBakalariStore from "@/src/utils/useBakalariStore";

import useLogger from "@hooks/useLogger";
import PageMenu from "@/src/components/menu/PageMenu";
import { getMondayDate } from "@/src/utils/utils";
import { Empty } from "@src/assets/images";

const { log } = useLogger("timetable", "modules");

export default function Page() {
  const { api, setLoaderVisible } = useBakalariStore();
  const ApiRequests = useApiRequests(api);

  const [dateModifier, setDateModifier] = useState(0);
  const date = getMondayDate(dateModifier);

  const [type, setType] = useState<"actual" | "permanent">("actual");

  const { data, isFetching } = useQuery(
    ApiRequests.timetable({ type, date })
  );

  useEffect(() => {
    log.navigation("opened");
  }, []);

  useEffect(() => {
    setLoaderVisible(isFetching ? "simple" : false);
  }, [isFetching]);

  return (
    <View flex={1}>
      <View flex={1}>
        {data == null ? (
          <NoData />
        ) : (
          <>
            <Text>Timetable</Text>
            <Text>
              {type}:{date}
            </Text>
          </>
        )}
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
            text: type === "actual" ? "Aktuální" : "Stálý",
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

const NoData = () => {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Empty width={100} height={100} />
    </View>
  );
};
