import { Text } from "tamagui";
import useBakalariStore from "@utils/useBakalariStore";
import { useAuth } from "@/src/hooks/useAuth";
import useLogger from "@/src/hooks/useLogger";

export default function Page() {
  const { api } = useBakalariStore();
  const { logout } = useAuth();
  const { log } = useLogger("timetable", "modules");

  // logout();

  log("opened", `loginAPI ${api == null ? "null" : "ready"}`);

  return <Text>Timetable</Text>;
}
