import { Redirect } from "expo-router";
import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@/src/hooks/useLogger";

export default function Page() {
  const { api } = useBakalariStore();
  const { log } = useLogger("index", "root");

  log("opened");

  if (api) return <Redirect href="/modules/timetable" />;

  return <Redirect href="/modules/timetable" />;
  // return <Redirect href="/login" />;
}
