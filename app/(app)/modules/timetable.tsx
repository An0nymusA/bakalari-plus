import { useEffect } from "react";
import { View, Text } from "tamagui";
import { useQueryClient } from "@tanstack/react-query";

import useLogger from "@hooks/useLogger";
import PageMenu from "@components/general/PageMenu";

export default function Page() {
  const { log } = useLogger("timetable", "modules");
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData(["timetable", "permanent"]);

  useEffect(() => {
    log.navigation("opened");

    // console.log(cachedData);
  });

  return (
    <View flex={1}>
      <View flex={1}>
        <Text color={"$grey0"}>Timetable</Text>
      </View>
      <PageMenu
        buttons={[
          {
            onPress: () => {},
            text: "Předchozí",
          },
          {
            onPress: () => {},
            text: "Stálý",
          },
          {
            onPress: () => {},
            text: "Další",
          },
        ]}
      />
    </View>
  );
}
