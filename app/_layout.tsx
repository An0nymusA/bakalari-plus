import { LogBox } from "react-native";
import { Slot, SplashScreen } from "expo-router";
import { TamaguiProvider, Theme } from "tamagui";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import queryClient, {
  asyncStoragePersister,
  dehydrateOptions,
} from "@/src/api/queryClient";
import StorageWrapper from "@utils/storage";
import config from "@/tamagui.config";

const IGNORED_LOGS = ["NativeEventEmitter"];

LogBox.ignoreLogs(IGNORED_LOGS);

// Do not log warning about `use NativeEventEmitter` in dev mode
if (__DEV__) {
  const withoutIgnored =
    // @ts-ignore


      (logger) =>
      // @ts-ignore
      (...args) => {
        const output = args.join(" ");

        if (!IGNORED_LOGS.some((log) => output.includes(log))) {
          logger(...args);
        }
      };

  console.log = withoutIgnored(console.log);
  console.info = withoutIgnored(console.info);
  console.warn = withoutIgnored(console.warn);
  console.error = withoutIgnored(console.error);
}

/* --------------------------------- */

// @ts-ignore
global.invalidateURL = async () => {
  const loginData = await StorageWrapper.get("loginData");

  await StorageWrapper.set("loginData", {
    ...loginData,
    baseUrl: "https://aasdasddam.cz",
  });

  console.log(await StorageWrapper.get("loginData"));
};

// @ts-ignore
global.validateURL = async () => {
  const loginData = await StorageWrapper.get("loginData");

  await StorageWrapper.set("loginData", {
    ...loginData,
    baseUrl: "http://adamz.cz",
  });

  console.log(await StorageWrapper.get("loginData"));
};

/* --------------------------------- */

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister, dehydrateOptions }}
    >
      <TamaguiProvider config={config}>
        <Theme name={"dark"}>
          <Slot />
        </Theme>
      </TamaguiProvider>
    </PersistQueryClientProvider>
  );
}
