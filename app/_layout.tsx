import { Slot } from "expo-router";
import { SplashScreen } from "expo-router";
import { LogBox } from "react-native";

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

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  return <Slot />;
}
