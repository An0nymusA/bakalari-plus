import { TimetableOptions } from "bakalari-ts-api/build/types/timetable";
import BakalariApi from "bakalari-ts-api/build/models/BakalariApi";
import {
  formatKomens,
  formatMarks,
  formatTimetable,
} from "bakalari-ts-api/build/utils/formattingUtils";

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

        const data = await api?.timetable(args);
        
        if (!data) {
          log.debug(`timetable:${logKey}`, "blank");
          setOffline();
          return null;
        }
        log.debug(`timetable:${logKey}`, "done");

        return data;
      },
      ...(type == "actual" && {
        gcTime: 2 * 24 * 60 * 60 * 1000,
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
});

export default useApiRequests;
