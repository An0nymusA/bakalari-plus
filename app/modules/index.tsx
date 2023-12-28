import { useEffect } from "react";
import { Redirect, SplashScreen } from "expo-router";

export default function Page() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <Redirect href="/modules/timetable" />;
}
