import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { onlineManager } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { BakalariApi, BakalariAuthOptions } from "bakalari-ts-api";

import StorageWrapper from "@utils/storage";
import useBakalariStore from "@utils/useBakalariStore";
import { setOffline } from "@utils/utils";
import useLogger from "./useLogger";
import queryClient from "../api/queryClient";

const { log } = useLogger("authHook", "hooks");

// Custom hook for handling authentication logic
const useAuth = () => {
  const { setApi } = useBakalariStore();
  const logout = useLogout();
  const refreshStorage = useStorageRefresh();

  // Check if the API is unreachable
  const isApiUnreachable = (e: AxiosError) =>
    e.code == "ERR_NETWORK" || e.response?.status == 404 || e.status == 404;

  const query = useQuery({
    queryKey: ["auth"],
    queryFn: async (): Promise<
      "network-error" | "error" | "success" | "pending" | "no-credentials"
    > => {
      const credentials: BakalariAuthOptions = await StorageWrapper.get(
        "loginData"
      );

      log.debug("starting-auth");

      if (credentials == null) {
        log.debug("no-credentials");

        return "no-credentials";
      }

      try {
        log.debug("trying-login");

        // Initialize the Bakalari API with the provided credentials
        const api = await BakalariApi.initialize({
          baseUrl: credentials.baseUrl,
          token: credentials.token,
          refreshToken: credentials.refreshToken,
          onLogin: refreshStorage,
        });

        onlineManager.setOnline(true);
        setApi(api);
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
    await StorageWrapper.clear();
    queryClient.clear();

    router.replace("/login");
  };
};

// Refresh the storage with the latest authentication options
const useStorageRefresh = () => {
  const { api } = useBakalariStore();

  return () => {
    const authOptions = api!.connector?.authOptions;

    StorageWrapper.set("loginData", {
      baseUrl: authOptions!.baseUrl,
      username: authOptions!.username,
      accessToken: authOptions!.token,
      refreshToken: authOptions!.refreshToken,
    });
  };
};

export default useAuth;
export { useStorageRefresh, useLogout };
