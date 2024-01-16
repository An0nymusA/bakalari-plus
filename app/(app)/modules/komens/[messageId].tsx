import { useEffect } from "react";
import { View } from "tamagui";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FormattedKomensMessage } from "bakalari-ts-api";

import useLogger from "@hooks/useLogger";
import useApiEndpoints from "@hooks/useApiEndpoints";
import NoData from "@components/modules/NoData";
import { KomensMessage } from "@components/modules/KomensMessage";
import PageMenu from "@components/menu/PageMenu";

const { log } = useLogger("komens-detail", "modules");

export default function Page() {
  const { messageId } = useLocalSearchParams<{ messageId: string }>();

  const { komens } = useApiEndpoints();
  const { data, isFetching } = useQuery<FormattedKomensMessage[]>(komens());

  const router = useRouter();

  useEffect(() => {
    log.navigation("opened");
  }, []);

  return (
    <View flex={1}>
      <View flex={1}>
        {data == null ? (
          <NoData showNoData={!isFetching} />
        ) : (
          <KomensMessage
            data={data.find((message) => message.Id == messageId)}
          />
        )}
      </View>
      <PageMenu
        buttons={[
          {
            onPress: () => {
              router.push("/modules/komens");
            },
            text: "Zpět",
          },
        ]}
      />
    </View>
  );
}
