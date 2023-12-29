import { Text, View } from "tamagui";
import useLogger from "@/src/hooks/useLogger";
import { useEffect } from "react";

export default function Page() {
  const { log } = useLogger("timetable", "modules");

  // logout();

  useEffect(() => {
    log.navigation("opened");
  });

  return (
    <View flex={1}>
      <Text color={"$grey0"}>Timetable</Text>
    </View>
  );
}
