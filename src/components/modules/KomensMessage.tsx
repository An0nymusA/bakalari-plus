import { AttachmentInfo, FormattedKomensMessage } from "bakalari-ts-api";
import { useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";

import { File } from "@assets/images";
import useBakalariStore from "@hooks/useBakalariStore";
import { download, formatSenderName } from "@moduleUtils/KomensUtils";
import { formatDate } from "@utils/utils";

export const KomensMessage = ({
  data,
}: {
  data: FormattedKomensMessage | undefined;
}) => {
  if (!data) return;

  const { width } = useWindowDimensions();
  const { onlineStatus, setLoaderVisible } = useBakalariStore();

  const handleDownload = async (attachment: AttachmentInfo) => {
    setLoaderVisible("transparent");
    await download(attachment, !!onlineStatus);
    setLoaderVisible(false);
  };

  return (
    <YStack backgroundColor={"$background"} flex={1} alignItems="center">
      <XStack
        backgroundColor={"$grey100"}
        padding={"$3"}
        width={"100%"}
        alignItems="center"
      >
        <Text flex={1} color={"white"} fontSize={"$3"}>
          {formatSenderName(data.Sender.Name)}
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
            <XStack
              flexWrap="wrap"
              width={"100%"}
              marginBottom={"$4"}
              gap={"$2"}
            >
              {data.Attachments.map((attachment) => (
                <XStack
                  key={attachment.Id}
                  onPress={() => handleDownload(attachment)}
                  opacity={onlineStatus ? 1 : 0.5}
                  padding={"$2"}
                  backgroundColor={"$primaryTransparent"}
                  gap={"$1"}
                  borderRadius={"$2"}
                  maxWidth="100%"
                >
                  <File width={18} height={18} />
                  <Text $xsPortrait={{ maxWidth: 250 }} color={"$primary"}>
                    {attachment.Name}
                  </Text>
                </XStack>
              ))}
            </XStack>
          )}
          <RenderHtml
            source={{ html: data.Text }}
            baseStyle={{ color: "white" }}
            defaultTextProps={{ selectable: true }}
            allowedStyles={["marginBottom", "marginRight", "marginLeft"]}
            contentWidth={width - 32}
          />
        </YStack>
        <View height={"$4"} />
      </ScrollView>
    </YStack>
  );
};
