import {
  Absences,
  BakalariApi,
  FormattedKomensMessage,
  FormattedMarks,
  FormattedTimetable,
  TimetableOptions,
  User,
  formatKomens,
  formatMarks,
  formatTimetable,
} from "bakalari-ts-api";

import useBakalariStore from "@hooks/useBakalariStore";
import useLogger from "@hooks/useLogger";
import { UndefinedInitialDataOptions } from "@tanstack/react-query";
import { getMondayDate, setOffline } from "@utils/utils";

const { log } = useLogger("queries", "api");

const checkData = (
  context: string,
  api: BakalariApi | null,
  ...data: (object | undefined)[]
) => {
  if (api == null) {
    log.debug(context, "api not set");
    throw new Error("api blank");
  }

  if (data.some((d) => !d)) {
    log.debug(context, "blank");
    setOffline();
    throw new Error("blank");
  }

  log.debug(context, "done");
};

const useApiEndpoints = () => ({
  // Function to fetch marks data
  marks: (
    api?: BakalariApi | null
  ): UndefinedInitialDataOptions<FormattedMarks> => ({
    queryKey: ["module", "marks"],
    queryFn: async () => {
      if (!api) api = useBakalariStore.getState().api;
      log.debug("marks");

      const data = await api?.marks();

      checkData("marks", api, data);

      return formatMarks(data!);
    },
    networkMode: "offlineFirst",
  }),

  // Function to fetch timetable data
  timetable: (
    args: TimetableOptions = { type: "actual" },
    api?: BakalariApi | null
  ): UndefinedInitialDataOptions<FormattedTimetable> => {
    const { date, type } = args;
    const key = type == "permanent" ? "permanent" : date ?? getMondayDate(0);
    const logKey = type?.charAt(0).toLowerCase();

    return {
      queryKey: ["module", "timetable", key],
      queryFn: async () => {
        if (!api) api = useBakalariStore.getState().api;
        log.debug(`timetable:${logKey}`);

        const data = await api?.timetable({ date, type });

        checkData(`timetable:${logKey}`, api, data);

        return formatTimetable(data!);
      },
      ...(type == "actual" && {
        gcTime: 2 * 24 * 60 * 60 * 1000,
      }),
      ...(date != getMondayDate(0) && {
        refetchInterval: Infinity,
      }),
      networkMode: "offlineFirst",
    };
  },

  // Function to fetch komens data
  komens: (
    api?: BakalariApi | null
  ): UndefinedInitialDataOptions<FormattedKomensMessage[]> => ({
    queryKey: ["module", "komens"],
    queryFn: async () => {
      if (!api) api = useBakalariStore.getState().api;
      log.debug("komens");

      const received: any = await api?.komens();
      const noticeboard = await api?.komens({ noticeboard: true });

      checkData("komens", api, received, noticeboard);

      return formatKomens(received, noticeboard);
    },
    networkMode: "offlineFirst",
  }),

  // Function to fetch absence data
  absence: (
    api?: BakalariApi | null
  ): UndefinedInitialDataOptions<Absences | undefined> => ({
    queryKey: ["module", "absence"],
    queryFn: async () => {
      if (!api) api = useBakalariStore.getState().api;
      log.debug("absence");

      const data = await api?.absence();

      checkData("absence", api, data);

      return data;
    },
    networkMode: "offlineFirst",
  }),
  user: (
    api?: BakalariApi | null
  ): UndefinedInitialDataOptions<User | undefined> => ({
    queryKey: ["module", "user"],
    queryFn: async () => {
      if (!api) api = useBakalariStore.getState().api;

      log.debug("user");

      const data = await api?.user();

      checkData("user", api, data);

      return data;
    },
    networkMode: "offlineFirst",
  }),
});

export default useApiEndpoints;
