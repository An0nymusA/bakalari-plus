import { Slot } from "expo-router";
import { SplashScreen} from "expo-router";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {

  return <Slot />;
}
