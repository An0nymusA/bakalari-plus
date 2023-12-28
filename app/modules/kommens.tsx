import { Text, View } from "tamagui";
import useBakalariStore from "@utils/useBakalariStore";
import { useAuth } from "@/src/hooks/useAuth";
import useLogger from "@/src/hooks/useLogger";

export default function Page() {
  const { api } = useBakalariStore();
  const { logout } = useAuth();
  const { log } = useLogger("kommens", "modules");

  // logout();

  log.navigation("opened");
  log.info(`loginAPI ${api == null ? "null" : "ready"}`)

  return (
    <View flex={1}>
      <Text color="$grey0">Kommens</Text>
    </View>
  );
}
