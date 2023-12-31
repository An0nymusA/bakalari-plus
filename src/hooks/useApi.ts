import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import useBakalariStore from "@utils/useBakalariStore";
import { getMondayDate } from "@utils/utils";
import useApiRequests from "@hooks/ApiRequests";

const useApi = () => {
  const { api } = useBakalariStore();
  const ApiRequests = useApiRequests(api!);

  const [isFetching, setIsFetching] = useState(true);

  const data = useQueries({
    queries: [
      ApiRequests.marks(),
      ApiRequests.kommens(),
      ApiRequests.timetable({ type: "permanent" }),
      ApiRequests.timetable({ type: "actual", date: getMondayDate(0) }),
    ],
  });

  useEffect(() => {
    setIsFetching(data.some((query) => query.isFetching));
  }, [data]);

  return isFetching;
};

export default useApi;
