import { useRef, useEffect, useMemo } from "react";
import { Text, styled, ScrollView, YStack, XStack, useMedia } from "tamagui";
import {
  FormattedTimetable,
  FormattedTimetableDay,
  FormattedTimetableHour,
} from "bakalari-ts-api";
import { formatDate } from "@utils/utils";
import { TableProvider, useTable } from "@hooks/useTable";
import { useTime } from "@/src/hooks/useTime";
import {
  getCurrentOrOngoinHour,
  getMaxNestedInColumn,
  calculateColWidths,
  isRowBlank,
} from "@/src/moduleUtils/TimetableUtils";

const minCellWidth = 80;

export default function Timetable({
  data,
  type,
}: {
  data: FormattedTimetable;
  type: "actual" | "permanent";
}) {
  /**
   * Timetable -> Row (Head - Top|Side, Normal) -> Cell (Head - Top|Side, Normal)
   */

  const media = useMedia();
  const scrollViewRef = useRef<ScrollView>(null);
  const now = useTime(5000);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  }, [data]);

  const activeDay = useMemo(() => {
    const currentDay = now.getDay();
    return currentDay <= 5 ? currentDay : null;
  }, [now]);

  const activeHour = useMemo(
    () => getCurrentOrOngoinHour(data.HoursLabels, now),
    [activeDay]
  );

  const colWidth = useMemo(
    () => calculateColWidths(getMaxNestedInColumn(data), minCellWidth),
    [data]
  );

  const content = useMemo(() => {
    return (
      <TableProvider
        cols={colWidth}
        activeDay={activeDay}
        activeHour={activeHour}
        type={type}
      >
        <YStack flex={1} width={"100%"}>
          <LabelsRow data={data} />
          {Object.entries(data.Days).map(([dayId, day]) => (
            <DayRow key={dayId} dayId={Number(dayId)} day={day} />
          ))}
        </YStack>
      </TableProvider>
    );
  }, [colWidth, activeHour]);

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
      {Object.values(data.HoursLabels).map((day) => (
        <YLabel key={day.Id} width={cols[day.Id]} minWidth={cols[day.Id]}>
          <Text color="$primary" fontWeight="$medium" fontSize="$3">
            {day.Caption}
          </Text>
          <LabelTimeWrapper>
            <LabelTime>{day.BeginTime}</LabelTime>
            <LabelTime>{day.EndTime}</LabelTime>
          </LabelTimeWrapper>
        </YLabel>
      ))}
    </Row>
  );
};
const DayRow = ({
  day,
  dayId,
}: {
  day: FormattedTimetableDay;
  dayId: number;
}) => {
  return (
    <Row>
      <XLabel>
        <Text color="$primary" fontWeight="$medium" fontSize="$2">
          {formatDate(day.DayInfo.Date, "weekday")}
        </Text>
        <Text color="$grey0" fontWeight="$medium" fontSize="$1">
          {formatDate(day.DayInfo.Date, "date")}
        </Text>
      </XLabel>
      <HoursRow dayId={dayId} day={day} />
    </Row>
  );
};

const HoursRow = ({
  day,
  dayId,
}: {
  day: FormattedTimetableDay;
  dayId: number;
}) => {
  const { isActive } = useTable();

  const hours = Object.entries(day.Hours).map(([hourId, hour]) => (
    <HourCell
      active={isActive(Number(hourId), dayId)}
      key={hourId}
      hour={hour}
      hourIndex={Number(hourId)}
    />
  ));

  if (isRowBlank(day.Hours)) {
    return (
      <XStack flex={1}>
        {hours}
        <BlankRow>
          <Text color="$primary" fontWeight="$medium" fontSize="$3">
            {day.DayInfo.Description}
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
  active,
}: {
  hour: FormattedTimetableHour[] | null;
  hourIndex: number;
  active: boolean;
}) => {
  const { cols } = useTable();

  if (hour == null || hour.length === 0)
    return (
      <BlankCell
        active={active}
        minWidth={cols[hourIndex]}
        width={cols[hourIndex]}
      />
    );

  return (
    <NormalCell
      active={active}
      minWidth={cols[hourIndex]}
      width={cols[hourIndex]}
    >
      {hour.map((hourItem, index) => (
        <Cell
          borderLeftWidth={index > 0 ? 1 : 0}
          nested={true}
          key={index}
          change={!!hourItem.Change}
        >
          <Text color="$primaryLight" fontWeight="$medium" fontSize="$2">
            {hour.length > 1 &&
              hourItem.CycleIds != null &&
              `${hourItem.CycleIds[0]}:`}
            {hourItem.Subject}
          </Text>
          <XStack space="$1">
            <Text color="$grey60" fontSize="$1">
              {hourItem.Teacher}
            </Text>
            <Text color="$grey0" fontSize="$1">
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
  borderRightColor: "$grey80",
  borderLeftColor: "$cellTransparent",
  borderRightWidth: 1,
  variants: {
    active: {
      true: {
        backgroundColor: "$primaryTransparent",
        borderWidth: 1,
        borderColor: "$primaryLight",
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

const YLabel = styled(Cell, {
  backgroundColor: "$grey100",
});

const XLabel = styled(YLabel, {
  width: 60,
  minWidth: 60,
  flex: 0,
});

const LabelTimeWrapper = styled(XStack, {
  position: "absolute",
  left: 0,
  bottom: 0,
  width: "100%",
  justifyContent: "space-between",
  paddingBottom: "$2.5",
  paddingHorizontal: "$0.5",
  $landscape: {
    paddingBottom: "$2",
  },
});

const LabelTime = styled(Text, {
  fontWeight: "$medium",
  fontSize: "$1.5",
  color: "$grey40",
  rotate: "-60deg",
  $landscape: {
    fontSize: "$0.5",
  },
});

const BlankCell = styled(Cell, {
  backgroundColor: "$background",
});

const NormalCell = styled(Cell, {
  backgroundColor: "$transparent",
  flexDirection: "row",
});
