import { useWindowDimensions } from "react-native";
import { Text, XStack, YStack, ScrollView, View } from "tamagui";
import { FormattedKomensMessage } from "bakalari-ts-api";
import RenderHtml from "react-native-render-html";

import { File } from "@/src/assets/images";
import { formatDate } from "@/src/utils/utils";

export const KomensMessage = ({
  data,
}: {
  data: FormattedKomensMessage | undefined;
}) => {
  if (!data) return;

  const { width } = useWindowDimensions();

  return (
    <YStack backgroundColor={"$background"} flex={1} alignItems="center">
      <XStack
        backgroundColor={"$grey100"}
        padding={"$3"}
        width={"100%"}
        alignItems="center"
      >
        <Text flex={1} color={"white"} fontSize={"$3"}>
          {data.Sender.Name.replace("(ředitelství)", "")}
        </Text>
        <Text color={"$grey40"} fontSize={"$2"} fontWeight={500}>
          {formatDate(data.SentDate, "relative")}
        </Text>
      </XStack>
      <ScrollView
        flex={1}
        width={"100%"}
        padding={"$4"}
        paddingBottom={0}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <YStack maxWidth={600}>
          {data.Attachments.length > 0 && (
            <XStack flexWrap="wrap" width={"100%"} marginBottom={"$4"}>
              {data.Attachments.map((attachment) => (
                <XStack
                  key={attachment.Id}
                  padding={"$2"}
                  backgroundColor={"$primaryTransparent"}
                  gap={"$1"}
                  borderRadius={"$2"}
                >
                  <File width={18} height={18} />
                  <Text color={"$primary"}>{attachment.Name}</Text>
                </XStack>
              ))}
            </XStack>
          )}
          <RenderHtml
            baseStyle={{ color: "white" }}
            allowedStyles={["marginBottom", "marginRight", "marginLeft"]}
            contentWidth={width - 32}
            source={{ html: data.Text }}
          />
        </YStack>
        <View height={"$4"} />
      </ScrollView>
    </YStack>
  );
};
