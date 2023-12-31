import { useEffect, useState } from "react";
import useBakalariStore from "../utils/useBakalariStore";
import { useQueries } from "@tanstack/react-query";
import {
  formatKommens,
  formatMarks,
  formatTimetable,
} from "bakalari-ts-api/build/utils/formattingUtils";
import useLogger from "../hooks/useLogger";
import { getMondayDate } from "../utils/utils";

const useApi = () => {
  const { api } = useBakalariStore();
  const [isLoading, setIsLoading] = useState(true);

  const { log } = useLogger("apiHook", "hooks");

  const data = useQueries({
    queries: [
      {
        queryKey: ["module", "marks"],
        queryFn: () => {
          log.debug("marks");

          return api?.marks().then((data) => {
            log.debug("marks", "done");
            return formatMarks(data);
          });
        },
      },
      {
        queryKey: ["module", "timetable", "permanent"],
        queryFn: () => {
          log.debug("timetable:p");

          return api?.timetable({ type: "permanent" }).then((data) => {
            log.debug("timetable:p", "done");
            return formatTimetable(data);
          });
        },
      },
      {
        queryKey: ["module", "timetable", getMondayDate(0)],
        queryFn: () => {
          log.debug("timetable:a");

          return api
            ?.timetable({ type: "actual", date: getMondayDate(0) })
            .then((data) => {
              log.debug("timetable:a", "done");
              return formatTimetable(data);
            });
        },
        staleTime: 2 * 24 * 60 * 60 * 1000, // 2 days
      },
      {
        queryKey: ["module", "kommens"],
        queryFn: async () => {
          log.debug("kommens");

          const received: any = await api?.kommens();
          const noticeboard = await api?.kommens({ noticeboard: true });

          log.debug("kommens", "done");

          return formatKommens(received, noticeboard);
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
