import { useRef, useEffect } from "react";
import { View, Text, styled, ScrollView, YStack } from "tamagui";
import {
  FormattedTimetable,
  FormattedTimetableDay,
  FormattedTimetableHour,
} from "bakalari-ts-api";
import { formatDate } from "@/src/utils/utils";

export default function Timetable({
  data,
  weekNumber,
}: {
  data: FormattedTimetable;
  weekNumber: number;
}) {
  /**
   * Timetable -> Row (Head - Top|Side, Normal) -> Cell (Head - Top|Side, Normal)
   */

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  }, [data]);

  return (
    <ScrollView
      // @ts-ignore
      ref={scrollViewRef}
      // display="flex"
      flex={1}
      // flexDirection="column"
      horizontal={true}
    >
      <YStack flex={1} minWidth={"100%"}>
        <Row>
          <Cell />
          {Object.values(data.hoursLabels).map((day) => (
            <Cell key={day.Id}>
              <Text color="$primary" fontWeight="$medium" fontSize="$2">
                {day.Caption}
              </Text>
            </Cell>
          ))}
        </Row>
        {Object.entries(data.days).map(([dayId, day]) => (
          <DayRow key={dayId} day={day} />
        ))}
      </YStack>
    </ScrollView>
  );
}

const DayRow = ({ day }: { day: FormattedTimetableDay }) => {
  return (
    <Row>
      <Cell>
        <Text color="$primary" fontWeight="$medium" fontSize="$2">
          {formatDate(day.dayInfo.date, "weekday")}
        </Text>
        <Text color="$grey0" fontWeight="$medium" fontSize="$1">
          {formatDate(day.dayInfo.date, "date")}
        </Text>
      </Cell>
      {/* <HoursRow day={day} /> */}
    </Row>
  );
};

const HoursRow = ({ day }: { day: FormattedTimetableDay }) => {
  if (day.hours == null || Object.values(day.hours).length === 0) {
    return Object.values(day.hours).map((hour) => <HourCell hour={hour} />);
  }

  return (
    <BlankRow>
      <Text color="$primary" fontWeight="$medium" fontSize="$3">
        {day.dayInfo.description}
      </Text>
    </BlankRow>
  );
};

const HourCell = ({ hour }: { hour: FormattedTimetableHour[] | null }) => {
  if (hour == null || hour.length === 0) return <Cell blank={true} />;

  return (
    <Cell>
      {hour.map((hour, index) => (
        <Cell key={index} change={!!hour.Change}>
          <Text color="$primary" fontWeight="$medium" fontSize="$2">
            {hour.Subject}
          </Text>
          <View display="flex" flexDirection="row">
            <Text color="$grey0" fontSize="$1">
              {hour.Teacher}
            </Text>
            <Text color="$grey60" fontSize="$1">
              {hour.Room}
            </Text>
          </View>
        </Cell>
      ))}
    </Cell>
  );
};

const Row = styled(View, {
  name: "Row",
  flex: 1,
  display: "flex",
  flexDirection: "row",
  borderColor: "$grey80",
  borderTopWidth: 1,
});

const BlankRow = styled(Row, {
  justifyContent: "center",
  borderTopWidth: 0,
  alignItems: "center",
  backgroundColor: "$grey80",
});

const Cell = styled(View, {
  name: "Cell",
  $portait: {
    width: 50,
  },
  $landscape: {
    flex: 1,
  },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderColor: "$grey80",
  borderLeftWidth: 1,
  borderRightWidth: 1,
  backgroundColor: "$grey100",
  variants: {
    blank: {
      true: {
        backgroundColor: "$background",
      },
    },
    change: {
      true: {
        backgroundColor: "$redTransparent",
      },
    },
  },
});
