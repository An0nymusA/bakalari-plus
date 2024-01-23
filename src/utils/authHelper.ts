import { BakalariApi, BakalariAuthOptions } from "bakalari-ts-api";
import StorageWrapper from "./storage";

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
