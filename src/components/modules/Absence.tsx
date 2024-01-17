import { Chevron } from "@/src/assets/images";
import {
  countMissedPerSubject,
  parseAbsencePerDay,
} from "@/src/moduleUtils/AbsenceUtils";
import { formatDate, roundPlaces } from "@/src/utils/utils";
import {
  Absences,
  Absence as ApiAbsence,
  AbsencesPerSubject,
} from "bakalari-ts-api";
import React from "react";
import { FlatList } from "react-native";
import { View, Text, YStack, XStack, Accordion, Square } from "tamagui";
import { HorizontalLine } from "../HorizontalLine";

const Absence = ({
  data,
  type,
}: {
  data: Absences;
  type: "date" | "subject";
}) => {
  const treshold = data.PercentageThreshold * 100;

  return (
    <>
      {type == "date" ? (
        <AbsencesByDate data={data.Absences} />
      ) : (
        <AbsencesBySubject treshold={treshold} data={data.AbsencesPerSubject} />
      )}
    </>
  );
};

const AbsencesByDate = ({ data }: { data: ApiAbsence[] }) => {
  return (
    <FlatList
      style={{ flex: 1 }}
      data={Object.values(data)}
      keyExtractor={(value) => value.Date}
      renderItem={({ item }) => <AbsencesByDateItem data={item} />}
      contentContainerStyle={{ marginHorizontal: 10 }}
    />
  );
};
const AbsencesByDateItem = ({ data }: { data: ApiAbsence }) => {
  const { ok, missed, parsed } = parseAbsencePerDay(data);

  if (ok == 0 && missed == 0) return null;

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
                <Text color={missed > 0 ? "$red" : "$grey0"} fontSize="$2.5">
                  {formatDate(data.Date, "weekday-date")}
                </Text>
                <XStack gap="$3">
                  <View>
                    <Text fontSize="$1.5" color="$grey60">
                      omluvené: <Text color="$grey40">{ok}</Text>
                    </Text>
                  </View>
                  <View>
                    <Text fontSize="$1.5" color="$grey60">
                      neomluvené: <Text color="$grey40">{missed}</Text>
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
            {parsed.map((item, index) => (
              <YStack key={item.name} paddingHorizontal={"$1"}>
                <XStack alignItems="center" paddingHorizontal={"$1"}>
                  <Text
                    textAlign="center"
                    minWidth={40}
                    color="$primary"
                    fontSize="$2.5"
                    fontWeight={"$medium"}
                  >
                    {item.value}
                  </Text>
                  <Text flex={1} fontSize="$1.5" color={"$grey0"}>
                    {item.name}
                  </Text>
                </XStack>
                {index < parsed.length - 1 && (
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

const AbsencesBySubject = ({
  data,
  treshold,
}: {
  data: AbsencesPerSubject[];
  treshold: number;
}) => {
  return (
    <FlatList
      style={{ flex: 1 }}
      data={Object.values(data)}
      keyExtractor={(value) => value.SubjectName}
      renderItem={({ item }) => (
        <AbsencesBySubjectItem treshold={treshold} data={item} />
      )}
      contentContainerStyle={{ marginHorizontal: 10 }}
    />
  );
};
const AbsencesBySubjectItem = ({
  data,
  treshold,
}: {
  data: AbsencesPerSubject;
  treshold: number;
}) => {
  const missed = countMissedPerSubject(data);
  const absence = roundPlaces((missed / data.LessonsCount) * 100, 2);

  if (data.SubjectName == "") {
    return null;
  }

  return (
    <YStack
      padding="$3"
      backgroundColor={"$grey100"}
      borderRadius={"$3"}
      marginBottom="$4"
      gap={"$1.5"}
    >
      <Text
        color={absence >= treshold ? "$red" : "$grey0"}
        fontSize={"$2.5"}
        textAlign="left"
      >
        {data.SubjectName}
      </Text>
      <XStack gap="$3" alignItems="center">
        <View>
          <Text fontSize="$1.5" color="$grey60">
            zameškané: <Text color="$grey40">{missed}</Text>
          </Text>
        </View>
        <View>
          <Text fontSize="$1.5" color="$grey60">
            celkově: <Text color="$grey40">{data.LessonsCount}</Text>
          </Text>
        </View>
        <View>
          <Text fontSize="$1.5" color="$grey60">
            absence: <Text color="$grey40">{absence}%</Text>
          </Text>
        </View>
      </XStack>
    </YStack>
  );
};

export default Absence;
