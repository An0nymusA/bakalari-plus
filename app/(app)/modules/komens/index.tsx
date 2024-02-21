import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { View } from "tamagui";

import Komens from "@components/modules/Komens";
import NoData from "@components/modules/NoData";
import useApiEndpoints from "@hooks/useApiEndpoints";
import useLogger from "@hooks/useLogger";

const { log } = useLogger("komens", "modules");

export default function Page() {
  const { komens } = useApiEndpoints();
  const { data, isFetching } = useQuery(komens());

  useEffect(() => {
    log.navigation("opened");
  }, []);

  return (
    <View flex={1}>
      <View flex={1} paddingTop="$2.5">
        {data == null ? (
          <NoData showNoData={!isFetching} />
        ) : (
          <Komens data={data} />
        )}
      </View>
    </View>
  );
}
