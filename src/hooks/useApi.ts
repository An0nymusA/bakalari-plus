import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import useBakalariStore from "@utils/useBakalariStore";
import { getMondayDate } from "@utils/utils";
import useApiRequests from "@/src/hooks/useApiEndpoints";

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

export default useApi;
