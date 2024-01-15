import { Query, QueryCache, QueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import useLogger from "../hooks/useLogger";

const { log } = useLogger("react-query");

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: 2.5 * 60 * 1000, // 2.5 minutes
      staleTime: 2.5 * 60 * 1000 - 1,
      gcTime: Infinity,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => log.error(`Error - ${error.message}`),
  }),
});

const dehydrateOptions = {
  shouldDehydrateQuery: (query: Query) => {
    const queryIsReadyForPersistance = query.state.status === "success";
    if (queryIsReadyForPersistance) {
      const { queryKey } = query;
      const excludeFromPersisting = queryKey.includes("auth");
      return !excludeFromPersisting;
    }
    return queryIsReadyForPersistance;
  },
};

export default queryClient;
export { asyncStoragePersister, dehydrateOptions };
