import { FlatList } from "react-native";
import { Text, View, Accordion, Square, YStack, XStack } from "tamagui";
import {
  FormattedMarks,
  FormattedMarksByDate,
  FormattedMarksBySubject,
  FormattedMarkBySubject,
  FormattedMarkByDate,
  Mark,
} from "bakalari-ts-api";

import { Chevron, Weight } from "@/src/assets/images";
import { formatDate, capitalize } from "@/src/utils/utils";
import { HorizontalLine } from "../HorizontalLine";
import MarkPredictor from "./MarkPredictor";
import { formatTheme } from "@/src/moduleUtils/MarksUtils";

const Marks = ({
  data,
  type,
}: {
  data: FormattedMarks;
  type: "date" | "subject";
}) => {
  return (
    <>
      <MarkPredictor marks={data.Subject} />
      {type == "date" ? (
        <MarksByDate data={data.Date} />
      ) : (
        <MarksBySubject data={data.Subject} />
      )}
    </>
  );
};

const MarksBySubject = ({ data }: { data: FormattedMarksBySubject }) => {
  return (
    <FlatList
      style={{ flex: 1 }}
      data={Object.entries(data)}
      keyExtractor={([key]) => key}
      renderItem={({ item: [, marks] }) => <MarkSubject data={marks} />}
      contentContainerStyle={{ marginHorizontal: 10 }}
    />
  );
};
const MarkSubject = ({ data }: { data: FormattedMarkBySubject }) => {
  return (
    <Accordion
      width="100%"
      type="multiple"
      marginBottom={"$4"}
      borderRadius={"$3"}
      overflow="hidden"
    >
      <Accordion.Item value="a1">
        <Accordion.Trigger unstyled={true}>
          {({ open }: { open: boolean }) => (
            <XStack
              backgroundColor="$grey100"
              alignItems="center"
              justifyContent="space-between"
              padding="$3"
            >
              <YStack gap="$1.5">
                <Text color="$grey0" fontSize="$2.5">
                  {data.Subject.Name}
                </Text>
                <XStack gap="$3">
                  <View>
                    <Text fontSize="$1.5" color="$grey60">
                      průměr: <Text color="$grey40">{data.AverageText}</Text>
                    </Text>
                  </View>
                  <View>
                    <Text fontSize="$1.5" color="$grey60">
                      známky:{" "}
                      <Text color="$grey40">
                        {Object.values(data.Marks).length}
                      </Text>
                    </Text>
                  </View>
                </XStack>
              </YStack>
              <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                <Chevron width={24} height={24} />
              </Square>
            </XStack>
          )}
        </Accordion.Trigger>
        <Accordion.Content
          unstyled={true}
          paddingTop={"$2"}
          paddingBottom={"$2.5"}
          backgroundColor={"$transparent"}
        >
          <YStack>
            {Object.values(data.Marks).map((mark, index) => (
              <YStack key={mark.Id} paddingHorizontal={"$1"}>
                <SubjectMarkItem mark={mark} />
                {index < Object.values(data.Marks).length - 1 && (
                  <HorizontalLine
                    backgroundColor="$grey80"
                    marginVertical={"$2"}
                  />
                )}
              </YStack>
            ))}
          </YStack>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
const SubjectMarkItem = ({ mark }: { mark: Mark }) => {
  return (
    <>
      <XStack alignItems="center" paddingHorizontal={"$1"}>
        <Text
          textAlign="center"
          minWidth={40}
          color="$primary"
          fontSize="$2.5"
          fontWeight={"$medium"}
        >
          {mark.MarkText}
        </Text>
        <YStack flex={1}>
          <Text fontSize="$1.5" color={"$grey0"}>
            {capitalize(mark.Caption)}
          </Text>
          {!!mark.Theme && (
            <Text maxWidth={"90%"} fontSize="$1" color={"$grey60"}>
              {'"'}
              {formatTheme(capitalize(mark.Theme))}
              {'"'}
            </Text>
          )}
        </YStack>
        <YStack alignItems="flex-end">
          <Text color={"$grey40"}>{formatDate(mark.MarkDate, "fulldate")}</Text>
          <XStack alignItems="center" gap="$0.5">
            <Weight width={20} height={20} />
            <Text color="$primaryLight" fontWeight="$medium">
              {mark.Weight}
            </Text>
          </XStack>
        </YStack>
      </XStack>
    </>
  );
};

const MarksByDate = ({ data }: { data: FormattedMarksByDate }) => {
  return (
    <FlatList
      style={{ flex: 1 }}
      data={Object.entries(data)}
      keyExtractor={([key]) => key}
      renderItem={({ item: [, mark] }) => <MarkDate mark={mark} />}
      contentContainerStyle={{ marginHorizontal: 10 }}
    />
  );
};
const MarkDate = ({ mark }: { mark: FormattedMarkByDate }) => {
  return (
    <View
      backgroundColor="$grey100"
      borderWidth={
        new Date().getTime() - new Date(mark.MarkDate).getTime() <
        3 * 24 * 60 * 60 * 1000
          ? 1
          : 0
      }
      borderColor={"$grey60"}
      marginBottom={"$4"}
      paddingVertical={"$2"}
      paddingLeft={"$1"}
      paddingRight={"$4"}
      borderRadius={"$3"}
    >
      <XStack alignItems="center">
        <Text
          textAlign="center"
          minWidth={40}
          color="$primary"
          fontSize="$2.5"
          fontWeight={"$medium"}
        >
          {mark.MarkText}
        </Text>
        <YStack flex={1}>
          <Text fontSize="$2" color={"$primaryLight"} fontWeight={"$medium"}>
            {capitalize(mark.Subject.Name)}
          </Text>
          <Text mt={"$0.5"} fontSize="$1.5" color={"$grey0"}>
            {capitalize(mark.Caption)}
          </Text>
          {!!mark.Theme && (
            <Text maxWidth={"90%"} fontSize="$1" color={"$grey60"}>
              {'"'}
              {formatTheme(capitalize(mark.Theme))}
              {'"'}
            </Text>
          )}
        </YStack>
        <YStack alignItems="flex-end">
          <Text color={"$grey40"}>{formatDate(mark.MarkDate, "fulldate")}</Text>
          <XStack alignItems="center" gap="$0.5">
            <Weight width={20} height={20} />
            <Text color="$primaryLight" fontWeight="$medium">
              {mark.Weight}
            </Text>
          </XStack>
        </YStack>
      </XStack>
    </View>
  );
};

export default Marks;
