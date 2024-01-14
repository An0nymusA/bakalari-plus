import {
  BakalariApi,
  TimetableOptions,
  formatKomens,
  formatMarks,
  formatTimetable,
} from "bakalari-ts-api";

import useLogger from "@hooks/useLogger";
import { getMondayDate, setOffline } from "@utils/utils";

const { log } = useLogger("queries", "api");

const useApiRequests = (api: BakalariApi | null) => ({
  // Function to fetch marks data
  marks: () => ({
    queryKey: ["module", "marks"],
    queryFn: async () => {
      log.debug("marks");

      const data = await api?.marks();

      if (!data) {
        log.debug("marks", "blank");
        setOffline();
        return null;
      }
      log.debug("marks", "done");

      return formatMarks(data);
    },
  }),

  // Function to fetch timetable data
  timetable: (args: TimetableOptions = { type: "actual" }) => {
    const { date, type } = args;
    const key = type == "permanent" ? "permanent" : date ?? getMondayDate(0);
    const logKey = type?.charAt(0).toLowerCase();

    return {
      queryKey: ["module", "timetable", key],
      queryFn: async () => {
        log.debug(`timetable:${logKey}`);

        const data = await api?.timetable({ date, type });

        if (!data) {
          log.debug(`timetable:${logKey}`, "blank");
          setOffline();
          return null;
        }
        log.debug(`timetable:${logKey}`, "done");

        return formatTimetable(data);
      },
      ...(type == "actual" && {
        gcTime: 2 * 24 * 60 * 60 * 1000,
      }),
      ...(date != getMondayDate(0) && {
        refetchInterval: Infinity,
      }),
    };
  },

  // Function to fetch kommens data
  komens: () => ({
    queryKey: ["module", "kommens"],
    queryFn: async () => {
      log.debug("kommens");

      const received: any = await api?.komens();
      const noticeboard = await api?.komens({ noticeboard: true });

      if (!received || !noticeboard) {
        log.debug("kommens", "blank");
        setOffline();
        return null;
      }
      log.debug("kommens", "done");

      return formatKomens(received, noticeboard);
    },
  }),

  // Function to fetch absence data
  absence: () => ({
    queryKey: ["module", "absence"],
    queryFn: async () => {
      log.debug("absence");

      const data = await api?.absence();

      if (!data) {
        log.debug("absence", "blank");
        setOffline();
        return null;
      }
      log.debug("absence", "done");

      return data;
    },
  }),
});

export default useApiRequests;
