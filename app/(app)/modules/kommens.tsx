import { Text, View } from "tamagui";
import useLogger from "@hooks/useLogger";
import { useEffect } from "react";

const { log } = useLogger("kommens", "modules");

export default function Page() {

  useEffect(() => {
    log.navigation("opened");
  }, []);

  return (
    <View flex={1}>
      <Text color="$grey0">Kommens</Text>
    </View>
  );
}
