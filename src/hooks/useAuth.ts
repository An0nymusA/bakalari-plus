import { useRouter } from "expo-router";

import BakalariApi from "bakalari-ts-api/build/models/BakalariApi";
import { BakalariAuthOptions } from "bakalari-ts-api/build/models/BakalariApiConnector";
import StorageWrapper from "../utils/storage";
import useBakalariStore from "../utils/useBakalariStore";
import { AxiosError } from "axios";
import useLogger from "./useLogger";

export const useAuth = () => {

  const { setAuthStatus } = useBakalariStore();
  const router = useRouter();

  const { log } = useLogger("authHook", "hooks");

  const { api, setApi } = useBakalariStore();

  const refreshStorage = () => {
    const authOptions = api!.connector?.authOptions;

    StorageWrapper.set("loginData", {
      baseUrl: authOptions!.baseUrl,
      username: authOptions!.username,
      accessToken: authOptions!.token,
      refreshToken: authOptions!.refreshToken,
    });
  };

  const login = async (credentials: BakalariAuthOptions) => {
    log("starting");

    if (credentials == null) {
      log("no-credentials");

      setAuthStatus("success");
      return;
    }

    try {
      log("trying");

      const api = await BakalariApi.initialize({
        baseUrl: credentials.baseUrl,
        token: credentials.token,
        refreshToken: credentials.refreshToken,
        onLogin: refreshStorage,
      });

      setApi(api);
      setAuthStatus("success");
    } catch (e) {
      log("error");

      if (e instanceof AxiosError) {
        if (
          e.response?.data?.error_description ==
          `The specified refresh token has already been redeemed.`
        ) {
          logout();
        }

        if (e.code == "ERR_NETWORK") {
          setAuthStatus("network-error");
          return;
        }
      }

      setAuthStatus("error");
    }
  };

  const logout = () => {
    setApi(null);
    StorageWrapper.remove("loginData");

    router.replace("/login");
  };

  return { login, logout };
};
