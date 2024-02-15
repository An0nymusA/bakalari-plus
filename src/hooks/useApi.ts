import { Query, useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import queryClient from "@api/queryClient";
import useApiEndpoints from "@hooks/useApiEndpoints";
import { getMondayDate } from "@utils/utils";

const useApi = () => {
  const { marks, komens, timetable, absence, user } = useApiEndpoints();

  const [isFetching, setIsFetching] = useState(true);

  const data = useQueries({
    queries: [
      user(),
      marks(),
      komens(),
      absence(),
      timetable({ type: "permanent" }),
      timetable({ type: "actual", date: getMondayDate(0) }),
    ],
  });

  useEffect(() => {
    setIsFetching(data.some((query) => query.isFetching));
  }, [data]);

  return isFetching;
};

export const invalidateQueries = async () => {
  await queryClient.invalidateQueries({
    predicate(query: Query) {
      if (query.queryKey[0] !== "module") return false;

      if (
        query.queryKey[1] === "timetable" &&
        query.queryKey[2] != getMondayDate(0)
      )
        return false;

      return true;
    },
  });
};

export const isInCache = (...key: string[]) => {
  return !!queryClient.getQueryCache().find({
    queryKey: key,
  });
};

export default useApi;
