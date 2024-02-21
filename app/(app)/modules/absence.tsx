import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { View } from "tamagui";

import PageMenu from "@components/menu/PageMenu";
import Absence from "@components/modules/Absence";
import NoData from "@components/modules/NoData";
import useApiEndpoints from "@hooks/useApiEndpoints";
import useLogger from "@hooks/useLogger";

const { log } = useLogger("absence", "modules");

export default function Page() {
  const { absence } = useApiEndpoints();
  const { data, isFetching } = useQuery(absence());

  const [type, setType] = useState<"date" | "subject">("subject");

  useEffect(() => {
    log.navigation("opened");
  }, []);

  return (
    <View flex={1}>
      <View flex={1} paddingTop="$2.5">
        {data == null ? (
          <NoData showNoData={!isFetching} />
        ) : (
          <Absence data={data} type={type} />
        )}
      </View>
      <PageMenu
        buttons={[
          {
            onPress: () => {
              setType("subject");
            },
            text: "Podle Předmětu",
            highlighted: type === "subject",
          },
          {
            onPress: () => {
              setType("date");
            },
            text: "Podle Data",
            highlighted: type === "date",
          },
        ]}
      />
    </View>
  );
}
