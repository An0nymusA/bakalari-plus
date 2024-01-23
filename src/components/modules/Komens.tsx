import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Text, YStack, XStack, styled, useMedia } from "tamagui";
import { FormattedKomensMessage } from "bakalari-ts-api";

import { capitalize, formatDate, stripHTMLTags } from "@/src/utils/utils";
import { formatSenderName } from "@/src/moduleUtils/KomensUtils";

const Komens = ({ data }: { data: FormattedKomensMessage[] }) => {
  return (
    <FlatList
      style={{ flex: 1 }}
      data={Object.values(data)}
      keyExtractor={(value) => value.Id}
      renderItem={({ item }) => <KomensItem data={item} />}
      contentContainerStyle={{ marginHorizontal: 10 }}
    />
  );
};

const KomensItem = ({ data }: { data: FormattedKomensMessage }) => {
  const router = useRouter();
  const media = useMedia();

  return (
    <YStack
      padding="$3"
      backgroundColor={"$grey100"}
      borderRadius={"$3"}
      marginBottom="$4"
      gap={"$2.5"}
      borderWidth={
        new Date().getTime() - new Date(data.SentDate).getTime() <
        3 * 24 * 60 * 60 * 1000
          ? 1
          : 0
      }
      borderColor={"$grey60"}
      onPress={() => {
        router.push(`/modules/komens/${data.Id}`);
      }}
    >
      <XStack alignItems="center">
        <Text color={"$grey0"} fontSize={"$2.5"} textAlign="left" flex={1}>
          {formatSenderName(data.Sender.Name)}
        </Text>
        <Text color={"$grey40"} fontSize={"$1.5"} fontWeight={500}>
          {formatDate(data.SentDate, "relative")}
        </Text>
      </XStack>
      <Text
        paddingRight={"$2"}
        color={"$grey60"}
        flex={1}
        numberOfLines={media.xs ? 2 : 1}
        ellipsizeMode="tail"
      >
        {stripHTMLTags(data.Text)}
      </Text>
      <XStack gap={"$1.5"}>
        <Pill backgroundColor={"$transparent"} color={"$grey40"}>
          {data.Channel == "noticeboard" ? "Nástěnka" : "Obecná"}
        </Pill>
        {data.RelevantPersonType != "teacher" && (
          <Pill backgroundColor={"$orangeTransparent"} color={"$orange"}>
            {capitalize(data.RelevantName)}
          </Pill>
        )}
        {data.CanConfirm && !data.Confirmed && (
          <Pill backgroundColor={"$greenTransparent"} color={"$green"}>
            Potvrdit
          </Pill>
        )}
        {data.Attachments.length > 0 && (
          <Pill backgroundColor={"$primaryTransparent"} color={"$primary"}>
            Příloha
          </Pill>
        )}
      </XStack>
    </YStack>
  );
};

const Pill = styled(Text, {
  fontWeight: 500,
  fontSize: "$1",
  paddingHorizontal: "$1.5",
  paddingVertical: "$1",
  borderRadius: "$2",
});

export default Komens;
