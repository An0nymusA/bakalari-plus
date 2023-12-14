import { useState } from "react";

import { useRouter } from "expo-router";

import BakalariApi from "bakalari-ts-api/build/models/BakalariApi";
import { BakalariAuthOptions } from "bakalari-ts-api/build/models/BakalariApiConnector";
import StorageWrapper from "../utils/storage";
import useBakalariStore from "../utils/useBakalariStore";
import { AxiosError } from "axios";
import useLogger from "./useLogger";

export const useAuth = () => {
  const [status, setStatus] = useState<string>("pending");
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

      setStatus("success");
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
      setStatus("success");
    } catch (e) {
      if (
        e instanceof AxiosError &&
        e.response?.data?.error_description ==
          `The specified refresh token has already been redeemed.`
      ) {
        logout();
      }
      log("error");

      setStatus("error");
    }
  };

  const logout = () => {
    setApi(null);
    StorageWrapper.remove("loginData");

    router.push("/login");
  };

  return { status, login, logout };
};
