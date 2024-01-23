import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { onlineManager } from "@tanstack/react-query";
import { AxiosError } from "axios";

import StorageWrapper from "@utils/storage";
import useBakalariStore from "@utils/useBakalariStore";
import { setupApi } from "@utils/authHelper";
import { setOffline, setOnline } from "@utils/utils";
import useLogger from "./useLogger";
import queryClient from "../api/queryClient";

const { log } = useLogger("authHook", "hooks");

// Custom hook for handling authentication logic
const useAuth = () => {
  const { setApi } = useBakalariStore();
  const logout = useLogout();

  // Check if the API is unreachable
  const isApiUnreachable = (e: AxiosError) =>
    e.code == "ERR_NETWORK" || e.response?.status == 404 || e.status == 404;

  const query = useQuery({
    queryKey: ["auth"],
    queryFn: async (): Promise<
      "network-error" | "error" | "success" | "pending" | "no-credentials"
    > => {
      log.debug("trying-auth");

      try {
        const api = await setupApi();

        if (api == null) {
          log.debug("no-credentials");

          return "no-credentials";
        }

        setApi(api);
        log.debug("success");

        setOnline();
      } catch (e) {
        // If the API is unreachable, continue in offline mode
        if (e instanceof AxiosError && isApiUnreachable(e)) {
          log.error("network-error");

          setOffline();
          return "network-error";
        }

        log.error("error", e);
        logout();
        return "error";
      }
      return "success";
    },
    networkMode: "always",
    staleTime: 0,
    refetchInterval: () =>
      onlineManager.isOnline() ? Infinity : 2.5 * 60 * 1000,
  });

  return query;
};

// Logout function
const useLogout = () => {
  const { setApi } = useBakalariStore();
  const router = useRouter();

  return async () => {
    log.info("logout");

    onlineManager.setOnline(false);

    setApi(null);
    router.replace("/login");

    await StorageWrapper.clear("lastUrl", "REACT_QUERY_OFFLINE_CACHE");
    queryClient.removeQueries();
  };
};

export default useAuth;
export { useLogout };
