import { useEffect, useState } from "react";
import { View } from "tamagui";
import { useQuery } from "@tanstack/react-query";

import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@hooks/useLogger";
import useApiRequests from "@hooks/useApiEndpoints";
import PageMenu from "@components/menu/PageMenu";
import Marks from "@components/modules/Marks";
import NoData from "@components/modules/NoData";

const { log } = useLogger("marks", "modules");

export default function Page() {
  const { api, setLoaderVisible } = useBakalariStore();
  const ApiRequests = useApiRequests(api);
  const { data, isFetching } = useQuery(ApiRequests.marks());

  const [type, setType] = useState<"date" | "subject">("subject");

  useEffect(() => {
    log.navigation("opened");
  }, []);

  return (
    <View flex={1}>
      <View flex={1} padding="$2.5" paddingBottom={0}>
        {data == null ? (
          <NoData showNoData={!isFetching} />
        ) : (
          <Marks data={data} type={type} />
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
