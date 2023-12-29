import { useRouter } from "expo-router";

import BakalariApi from "bakalari-ts-api/build/models/BakalariApi";
import { BakalariAuthOptions } from "bakalari-ts-api/build/models/BakalariApiConnector";
import StorageWrapper from "../utils/storage";
import useBakalariStore from "../utils/useBakalariStore";
import { AxiosError } from "axios";
import useLogger from "./useLogger";
import queryClient from "../api/queryClient";

const useAuth = () => {
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
    log.debug("starting-auth", JSON.stringify(credentials, null, 4));

    if (credentials == null) {
      log.debug("no-credentials");

      setAuthStatus("success");
      return;
    }

    try {
      log.debug("trying-login");

      const api = await BakalariApi.initialize({
        baseUrl: credentials.baseUrl,
        token: credentials.token,
        refreshToken: credentials.refreshToken,
        onLogin: refreshStorage,
      });

      setApi(api);
      setAuthStatus("success");
    } catch (e) {
      log.debug("error");
      console.log(JSON.stringify(e, null, 4));

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

  const logout = async () => {
    setApi(null);
    await StorageWrapper.clear();
    await queryClient.invalidateQueries();
    queryClient.removeQueries();

    router.replace("/login");
  };

  return { login, logout };
};

export default useAuth;