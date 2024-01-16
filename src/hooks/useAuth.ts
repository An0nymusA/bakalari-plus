import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { onlineManager } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { BakalariApi, BakalariAuthOptions } from "bakalari-ts-api";

import StorageWrapper from "@utils/storage";
import useBakalariStore from "@utils/useBakalariStore";
import { setOffline, setOnline } from "@utils/utils";
import useLogger from "./useLogger";
import queryClient from "../api/queryClient";

const { log } = useLogger("authHook", "hooks");

// Refresh the storage with the latest authentication options
const refreshStorage = async (token: string, refreshToken: string) => {
  StorageWrapper.set("loginData", {
    ...(await StorageWrapper.get("loginData")),
    accessToken: token,
    refreshToken: refreshToken,
  });
};

export const setupApi = async (): Promise<BakalariApi | null> => {
  const credentials: BakalariAuthOptions = await StorageWrapper.get(
    "loginData"
  );

  if (credentials == null) return null;

  return await BakalariApi.initialize({
    baseUrl: credentials.baseUrl,
    token: credentials.token,
    refreshToken: credentials.refreshToken,
    onLogin: refreshStorage,
  });
};

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
