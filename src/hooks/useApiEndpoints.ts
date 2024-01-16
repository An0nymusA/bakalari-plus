import {
  TimetableOptions,
  formatKomens,
  formatMarks,
  formatTimetable,
} from "bakalari-ts-api";

import useLogger from "@hooks/useLogger";
import { getMondayDate, setOffline } from "@utils/utils";
import useBakalariStore from "../utils/useBakalariStore";

const { log } = useLogger("queries", "api");

const checkData = (context: string, ...data: (object | undefined)[]) => {
  if (data.some((d) => !d)) {
    log.debug(context, "blank");
    setOffline();
    throw new Error("blank");
  }

  log.debug(context, "done");
};

const useApiEndpoints = () => ({
  // Function to fetch marks data
  marks: () => ({
    queryKey: ["module", "marks"],
    queryFn: async () => {
      log.debug("marks");

      const data = await useBakalariStore.getState().api?.marks();

      checkData("marks", data);

      return formatMarks(data!);
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

        const data = await useBakalariStore
          .getState()
          .api?.timetable({ date, type });

        checkData(`timetable:${logKey}`, data);

        return formatTimetable(data!);
      },
      ...(type == "actual" && {
        gcTime: 2 * 24 * 60 * 60 * 1000,
      }),
      ...(date != getMondayDate(0) && {
        refetchInterval: Infinity,
      }),
    };
  },

  // Function to fetch komens data
  komens: () => ({
    queryKey: ["module", "komens"],
    queryFn: async () => {
      log.debug("komens");

      const api = useBakalariStore.getState().api;
      const received: any = await api?.komens();
      const noticeboard = await api?.komens({ noticeboard: true });

      checkData("komens", received, noticeboard);

      return formatKomens(received, noticeboard);
    },
  }),

  // Function to fetch absence data
  absence: () => ({
    queryKey: ["module", "absence"],
    queryFn: async () => {
      log.debug("absence");

      const data = await useBakalariStore.getState().api?.absence();

      checkData("absence", data);

      return data;
    },
  }),
});

export default useApiEndpoints;
