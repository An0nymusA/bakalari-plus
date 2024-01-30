import { useQuery } from "@tanstack/react-query";
import { FormattedKomensMessage } from "bakalari-ts-api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "tamagui";

import PageMenu from "@components/menu/PageMenu";
import { KomensMessage } from "@components/modules/KomensMessage";
import NoData from "@components/modules/NoData";
import useApiEndpoints from "@hooks/useApiEndpoints";
import useLogger from "@hooks/useLogger";

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
