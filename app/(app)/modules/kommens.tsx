import { Text, View } from "tamagui";
import useLogger from "@/src/hooks/useLogger";
import { useEffect } from "react";

const { log } = useLogger("kommens", "modules");

export default function Page() {

  // logout();

  useEffect(() => {
    log.navigation("opened");
  }, [])

  return (
    <View flex={1}>
      <Text color="$grey0">Kommens</Text>
    </View>
  );
}
