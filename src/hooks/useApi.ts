import { useEffect, useState } from "react";
import { useQueries, Query } from "@tanstack/react-query";

import useBakalariStore from "@utils/useBakalariStore";
import { getMondayDate } from "@utils/utils";
import useApiRequests from "@hooks/useApiEndpoints";
import queryClient from "@src/api/queryClient";

const useApi = () => {
  const { api } = useBakalariStore();
  const { marks, komens, timetable } = useApiRequests(api!);

  const [isFetching, setIsFetching] = useState(true);

  const data = useQueries({
    queries: [
      marks(),
      komens(),
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
  return queryClient.getQueryCache().find({
    queryKey: key,
  });
};

export default useApi;
