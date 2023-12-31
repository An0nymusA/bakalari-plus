import { useRouter } from "expo-router";

import BakalariApi from "bakalari-ts-api/build/models/BakalariApi";
import { BakalariAuthOptions } from "bakalari-ts-api/build/models/BakalariApiConnector";
import StorageWrapper from "../utils/storage";
import useBakalariStore from "../utils/useBakalariStore";
import { AxiosError } from "axios";
import useLogger from "./useLogger";
import queryClient from "../api/queryClient";

const { log } = useLogger("authHook", "hooks");

const useAuth = () => {
  const { setAuthStatus } = useBakalariStore();
  const router = useRouter();

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

      setAuthStatus("no-credentials");
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

      if (
        e instanceof AxiosError &&
        (e.code == "ERR_NETWORK" ||
          e.response?.status == 404 ||
          e.status == 404)
      ) {
        setAuthStatus("network-error");
        return;
      }

      setAuthStatus("error");
      logout();
    }
  };

  const logout = async () => {
    log.info("logout");

    setApi(null);
    await StorageWrapper.clear();
    // await queryClient.invalidateQueries();
    queryClient.clear();

    router.replace("/login");
  };

  return { login, logout };
};

export default useAuth;
