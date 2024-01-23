import { useEffect, useState } from "react";
import { View } from "tamagui";
import { useQuery } from "@tanstack/react-query";

import useLogger from "@hooks/useLogger";
import useApiEndpoints from "@hooks/useApiEndpoints";
import NoData from "@components/modules/NoData";
import User from "@/src/components/modules/User";

const { log } = useLogger("absence", "modules");

export default function Page() {
  const ApiRequests = useApiEndpoints();
  const { data, isFetching } = useQuery(ApiRequests.user());

  useEffect(() => {
    log.navigation("opened");
  }, []);

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      {data == null ? (
        <NoData showNoData={!isFetching} />
      ) : (
        <User data={data} />
      )}
    </View>
  );
}
