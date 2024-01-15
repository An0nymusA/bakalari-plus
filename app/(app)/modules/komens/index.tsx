import { useEffect } from "react";
import { View } from "tamagui";
import { useQuery } from "@tanstack/react-query";

import useLogger from "@hooks/useLogger";
import useApiEndpoints from "@hooks/useApiEndpoints";
import NoData from "@components/modules/NoData";
import Komens from "@/src/components/modules/Komens";

const { log } = useLogger("komens", "modules");

export default function Page() {
  const ApiRequests = useApiEndpoints();
  const { data, isFetching } = useQuery(ApiRequests.komens());

  useEffect(() => {
    log.navigation("opened");
  }, []);

  return (
    <View flex={1}>
      <View flex={1} padding="$2.5" paddingBottom={0}>
        {data == null ? (
          <NoData showNoData={!isFetching} />
        ) : (
          <Komens data={data} />
        )}
      </View>
    </View>
  );
}
