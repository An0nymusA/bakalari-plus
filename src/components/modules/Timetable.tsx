import {
  FormattedTimetable,
  FormattedTimetableDay,
  FormattedTimetableHour,
} from "bakalari-ts-api";
import { useEffect, useMemo, useRef } from "react";
import { ScrollView, Text, XStack, YStack, styled, useMedia } from "tamagui";

import { TableProvider, useTable } from "@hooks/useTable";
import { useTime } from "@hooks/useTime";
import useTimetableModalStore from "@hooks/useTimetableModalStore";
import {
  calculateColWidths,
  getColOffset,
  getCurrentOrOngoinHour,
  getMaxNestedInColumn,
  isRowBlank,
} from "@moduleUtils/TimetableUtils";
import { formatDate, isToday } from "@utils/utils";

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

  const activeDay = useMemo(() => {
    const currentDay = now.getDay();
    return currentDay <= 5 ? currentDay : null;
  }, [data, now]);

  const activeHour = useMemo(
    () => getCurrentOrOngoinHour(data.HoursLabels, now),
    [data, now]
  );

  const colWidth = useMemo(
    () => calculateColWidths(getMaxNestedInColumn(data), media.xs ? 80 : 100),
    [data]
  );

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  }, [data]);

  useEffect(() => {
    if (activeHour == null || type == "permanent") return;
    if (!Object.values(data.Days).some((day) => isToday(day.DayInfo?.Date)))
      return;

    scrollViewRef.current?.scrollTo({
      x: getColOffset(colWidth, activeHour),
      y: 0,
      animated: true,
    });
  }, [data, activeHour]);

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

  const getHours = (isRowBlank: boolean = false) =>
    Object.entries(day.Hours).map(([hourId, hour]) => (
      <HourCell
        active={
          !isRowBlank && isActive(Number(hourId), dayId, day.DayInfo.Date)
        }
        dayId={dayId}
        key={`${hourId}:${dayId}`}
        hour={hour}
        hourIndex={Number(hourId)}
      />
    ));

  if (isRowBlank(day.Hours)) {
    return (
      <XStack flex={1}>
        {getHours(true)}
        <BlankRow>
          <Text color="$primary" fontWeight="$medium" fontSize="$3">
            {day.DayInfo.Description}
          </Text>
        </BlankRow>
      </XStack>
    );
  }

  return getHours();
};

const HourCell = ({
  hour,
  hourIndex,
  active,
  dayId,
}: {
  hour: FormattedTimetableHour[] | null;
  hourIndex: number;
  active: boolean;
  dayId: number;
}) => {
  const { cols } = useTable();
  const { setCurrent } = useTimetableModalStore();

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
        <NestedCell
          key={`${dayId}:${hourIndex}:${index}`}
          borderLeftWidth={index > 0 ? 1 : 0}
          change={!!hourItem.Change}
          onPress={() => {
            hourItem.Change != null && setCurrent(hourItem);
          }}
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
        </NestedCell>
      ))}
    </NormalCell>
  );
};

const Row = styled(XStack, {
  name: "Row",
  flex: 1,
  borderColor: "$grey80",
  borderBottomWidth: 1.5,
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
  minWidth: 80,
  width: 80,
  justifyContent: "center",
  alignItems: "center",
  borderRightColor: "$grey80",
  borderLeftColor: "$cellTransparent",
  borderRightWidth: 1.5,
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
  $gtXs: {
    paddingHorizontal: "$1",
    $landscape: {
      paddingBottom: "$3",
    },
  },
  $landscape: {
    paddingBottom: "$2",
  },
});

const LabelTime = styled(Text, {
  fontWeight: "$medium",
  color: "$grey40",
  rotate: "-60deg",
  fontSize: "$1.5",
  $gtXsLandscape: {
    fontSize: "$1.5",
  },
  $xsLandscape: {
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

const NestedCell = styled(Cell, {
  borderRightWidth: 0,
  flex: 1,
  height: "100%",
  $landscape: {
    width: "100%",
  },
});
