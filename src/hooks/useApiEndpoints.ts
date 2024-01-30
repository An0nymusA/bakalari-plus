import {
  BakalariApi,
  TimetableOptions,
  formatKomens,
  formatMarks,
  formatTimetable,
} from "bakalari-ts-api";

import useBakalariStore from "@hooks/useBakalariStore";
import useLogger from "@hooks/useLogger";
import { getMondayDate, setOffline } from "@utils/utils";

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
  marks: (api?: BakalariApi | null) => ({
    queryKey: ["module", "marks"],
    queryFn: async () => {
      if (!api) api = useBakalariStore.getState().api;
      log.debug("marks");

      const data = await api?.marks();

      checkData("marks", data);

      return formatMarks(data!);
    },
  }),

  // Function to fetch timetable data
  timetable: (
    args: TimetableOptions = { type: "actual" },
    api?: BakalariApi | null
  ) => {
    const { date, type } = args;
    const key = type == "permanent" ? "permanent" : date ?? getMondayDate(0);
    const logKey = type?.charAt(0).toLowerCase();

    return {
      queryKey: ["module", "timetable", key],
      queryFn: async () => {
        if (!api) api = useBakalariStore.getState().api;
        log.debug(`timetable:${logKey}`);

        const data = await api?.timetable({ date, type });

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
  komens: (api?: BakalariApi | null) => ({
    queryKey: ["module", "komens"],
    queryFn: async () => {
      if (!api) api = useBakalariStore.getState().api;
      log.debug("komens");

      const received: any = await api?.komens();
      const noticeboard = await api?.komens({ noticeboard: true });

      checkData("komens", received, noticeboard);

      return formatKomens(received, noticeboard);
    },
  }),

  // Function to fetch absence data
  absence: (api?: BakalariApi | null) => ({
    queryKey: ["module", "absence"],
    queryFn: async () => {
      if (!api) api = useBakalariStore.getState().api;
      log.debug("absence");

      const data = await api?.absence();

      checkData("absence", data);

      return data;
    },
  }),
  user: () => ({
    queryKey: ["module", "user"],
    queryFn: async () => {
      const api = useBakalariStore.getState().api;
      log.debug("user");

      const data = await api?.user();

      checkData("user", data);

      return data;
    },
  }),
});

export default useApiEndpoints;
