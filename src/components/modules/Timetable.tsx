import { useRef, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Text, styled, ScrollView, YStack, XStack, useMedia } from "tamagui";
import {
  FormattedTimetable,
  FormattedTimetableDay,
  FormattedTimetableHour,
} from "bakalari-ts-api";
import { formatDate, getMaxHoursPerDay } from "@utils/utils";
import { TableProvider, useTable } from "@hooks/useTable";

const minCellWidth = 80;

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

  const media = useMedia();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  }, [data]);

  const content = useMemo(() => {
    const colWidth = Object.entries(getMaxHoursPerDay(data)).reduce(
      (acc, [key, value]) => {
        acc[Number(key)] = value * minCellWidth;
        return acc;
      },
      {} as Record<number, number>
    );

    return (
      <TableProvider cols={colWidth}>
        <YStack flex={1} width={"100%"}>
          <LabelsRow data={data} />
          {Object.entries(data.days).map(([dayId, day]) => (
            <DayRow key={dayId} day={day} />
          ))}
        </YStack>
      </TableProvider>
    );
  }, [data]);

  return (
    <ScrollView
      // @ts-ignore
      ref={scrollViewRef}
      flex={1}
      width={"100%"}
      minWidth={"100%"}
      contentContainerStyle={{ minWidth: "100%" }}
      horizontal={true}
    >
      {content}
    </ScrollView>
  );
}

const LabelsRow = ({ data }: { data: FormattedTimetable }) => {
  const { cols } = useTable();

  return (
    <Row>
      <XLabel />
      {Object.values(data.hoursLabels).map((day) => (
        <YLabel key={day.Id} width={cols[day.Id]} minWidth={cols[day.Id]}>
          <Text color="$primary" fontWeight="$medium" fontSize="$3">
            {day.Caption}
          </Text>
        </YLabel>
      ))}
    </Row>
  );
};

const DayRow = ({ day }: { day: FormattedTimetableDay }) => {
  return (
    <Row>
      <XLabel>
        <Text color="$primary" fontWeight="$medium" fontSize="$2">
          {formatDate(day.dayInfo.date, "weekday")}
        </Text>
        <Text color="$grey0" fontWeight="$medium" fontSize="$1">
          {formatDate(day.dayInfo.date, "date")}
        </Text>
      </XLabel>
      <HoursRow day={day} />
    </Row>
  );
};

const HoursRow = ({ day }: { day: FormattedTimetableDay }) => {
  const hours = Object.entries(day.hours).map(([hourId, hour]) => (
    <HourCell key={hourId} hour={hour} hourIndex={Number(hourId)} />
  ));

  if (
    day.hours == null ||
    Object.keys(day.hours).length === 0 
    ||
    Object.values(day.hours).every((hour) => hour == null || hour.length === 0)
  ) {
    return (
      <XStack flex={1}>
        {hours}
        <BlankRow>
          <Text color="$primary" fontWeight="$medium" fontSize="$3">
            {day.dayInfo.description}
          </Text>
        </BlankRow>
      </XStack>
    );
  }

  return hours;
};

const HourCell = ({
  hour,
  hourIndex,
}: {
  hour: FormattedTimetableHour[] | null;
  hourIndex: number;
}) => {
  const { cols } = useTable();

  if (hour == null || hour.length === 0)
    return (
      <Cell minWidth={cols[hourIndex]} width={cols[hourIndex]} blank={true} />
    );

  return (
    <NormalCell minWidth={cols[hourIndex]} width={cols[hourIndex]}>
      {hour.map((hourItem, index) => (
        <Cell
          borderLeftWidth={index > 0 ? 1 : 0}
          nested={true}
          key={index}
          change={!!hourItem.Change}
        >
          <Text color="$primary" fontWeight="$medium" fontSize="$2">
            {hour.length > 1 &&
              hourItem.CycleIds != null &&
              `${hourItem.CycleIds[0]}:`}{" "}
            {hourItem.Subject}
          </Text>
          <XStack space="$1">
            <Text color="$grey0" fontSize="$1">
              {hourItem.Teacher}
            </Text>
            <Text color="$grey60" fontSize="$1">
              {hourItem.Room}
            </Text>
          </XStack>
        </Cell>
      ))}
    </NormalCell>
  );
};

const Row = styled(XStack, {
  name: "Row",
  flex: 1,
  borderColor: "$grey80",
  borderBottomWidth: 1,
  backgroundColor: "$background",
});

const BlankRow = styled(Row, {
  // borderTopWidth: 0,
  alignItems: "center",
  paddingHorizontal: "$4",
  backgroundColor: "$grey80",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderWidth: 0,
});

const Cell = styled(YStack, {
  name: "Cell",
  flex: 1,
  minWidth: minCellWidth,
  width: minCellWidth,
  justifyContent: "center",
  alignItems: "center",
  borderColor: "$grey80",
  borderLeftColor: "$cellTransparent",
  borderRightWidth: 1,
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
    nested: {
      true: {
        borderRightWidth: 0,
        flex: 1,
        height: "100%",
        $landscape: {
          width: "100%",
        },
      },
    },
  },
});

const NormalCell = styled(Cell, {
  backgroundColor: "$transparent",
  flexDirection: "row",
});

const YLabel = styled(Cell, {
  backgroundColor: "$grey100",
});

const XLabel = styled(YLabel, {
  width: 60,
  minWidth: 60,
  flex: "unset",
});
