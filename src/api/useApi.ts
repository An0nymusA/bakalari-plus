import { useEffect, useState } from "react";
import { log } from "../hooks/useLogger";
import useBakalariStore from "../utils/useBakalariStore";
import { useQueries } from "@tanstack/react-query";
import {
  formatMarks,
  formatTimetable,
} from "bakalari-ts-api/build/utils/formattingUtils";

const useApi = (log: log) => {
  const { api } = useBakalariStore();
  const [isLoading, setIsLoading] = useState(true);

  const data = useQueries({
    queries: [
      {
        queryKey: ["module:mark"],
        queryFn: () => {
          log.debug("fetching marks");

          return api?.marks().then((data) => {
            log.debug("fetching marks", "done");
            return formatMarks(data);
          });
        },
      },
      {
        queryKey: ["module:timetable", "actua"],
        queryFn: () => {
          log.debug("fetching timetable-a");

          return api?.timetable().then((data) => {

            log.debug("fetching timetable-a", "done");
            return formatTimetable(data);
          });
        },
      },
    ],
  });

  useEffect(() => {
    setIsLoading(data.some((query) => query.isLoading));
  }, [data]);

  return isLoading;
};

export default useApi;
