import { Text, View, Button } from "tamagui";
import useBakalariStore from "@utils/useBakalariStore";
import { useAuth } from "@/src/hooks/useAuth";
import useLogger from "@/src/hooks/useLogger";
import { setVisibility } from "@/src/components/general/MenuBackdrop";

export default function Page() {
  const { api } = useBakalariStore();
  const { logout } = useAuth();
  const { log } = useLogger("marks", "modules");

  // logout();

  log.navigation("opened");
  log.info(`loginAPI ${api == null ? "null" : "ready"}`)

  return (
    <View flex={1}>
      <Text color={"$grey0"}>Marks</Text>
    </View>
  );
}
