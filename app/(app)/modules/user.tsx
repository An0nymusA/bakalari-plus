import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { View } from "tamagui";

import NoData from "@components/modules/NoData";
import User from "@components/modules/User";
import useApiEndpoints from "@hooks/useApiEndpoints";
import useLogger from "@hooks/useLogger";

const { log } = useLogger("absence", "modules");

export default function Page() {
  const { user } = useApiEndpoints();
  const { data, isFetching } = useQuery(user());

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
