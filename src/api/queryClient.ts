import { QueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

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
      staleTime: (2.5 * 60 * 1000) - 1,
      gcTime: Infinity,
    },
  },
});

export default queryClient;
export { asyncStoragePersister };
