import { TimetableOptions } from "bakalari-ts-api/build/types/timetable";
import BakalariApi from "bakalari-ts-api/build/models/BakalariApi";
import {
  formatKommens,
  formatMarks,
  formatTimetable,
} from "bakalari-ts-api/build/utils/formattingUtils";

import useLogger from "@hooks/useLogger";
import { getMondayDate } from "@utils/utils";

const { log } = useLogger("queries", "api");

const useApiRequests = (api: BakalariApi | null) => ({
  marks: () => ({
    queryKey: ["module", "marks"],
    queryFn: () => {
      log.debug("marks");

      return api?.marks().then((data) => {
        log.debug("marks", "done");
        return formatMarks(data);
      });
    },
  }),
  timetable: (args: TimetableOptions = { type: "actual" }) => {
    const { date, type } = args;
    const key = type == "permanent" ? "permanent" : date ?? getMondayDate(0);
    const logKey = type?.charAt(0).toLowerCase();

    return {
      queryKey: ["module", "timetable", key],
      queryFn: () => {
        log.debug(`timetable:${logKey}`);

        return api?.timetable(args).then((data) => {
          log.debug(`timetable:${logKey}`, "done");
          return formatTimetable(data);
        });
      },
      ...(type == "actual"
        ? {
            gcTime: 2 * 24 * 60 * 60 * 1000,
          }
        : {}),
    };
  },
  kommens: () => ({
    queryKey: ["module", "kommens"],
    queryFn: async () => {
      log.debug("kommens");

      const received: any = await api?.kommens();
      const noticeboard = await api?.kommens({ noticeboard: true });

      log.debug("kommens", "done");

      return formatKommens(received, noticeboard);
    },
  }),
});

export default useApiRequests;
