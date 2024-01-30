import { FormattedTimetable, FormattedTimetableHour } from "bakalari-ts-api";

/**
 * Get the current or ongoing hour
 * @param labels hours labels
 * @param now current time
 * @returns the current ongoin HourID, or the next in row, or null
 */
export const getCurrentOrOngoinHour = (
  labels: FormattedTimetable["HoursLabels"],
  now: Date
) => {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const activeHourLabel = Object.values(labels).find((hourLabel) => {
    const begin = hourLabel.BeginTime; // HH:MM
    const end = hourLabel.EndTime; // HH:MM

    // check if current time is between begin and end
    const parseTime = (time: string): Date => {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
      return date;
    };

    const beginDate = parseTime(begin);
    const endDate = parseTime(end);

    return (
      (currentHour > beginDate.getHours() ||
        (currentHour === beginDate.getHours() &&
          currentMinute >= beginDate.getMinutes())) &&
      (currentHour < endDate.getHours() ||
        (currentHour === endDate.getHours() &&
          currentMinute < endDate.getMinutes()))
    );
  });

  if (activeHourLabel) {
    return activeHourLabel.Id;
  }

  // If no active hour found, get the next hour in the row
  const nextHourLabel = Object.values(labels).find((hourLabel) => {
    const begin = hourLabel.BeginTime; // HH:MM

    const parseTime = (time: string): Date => {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
      return date;
    };

    const beginDate = parseTime(begin);

    return (
      currentHour < beginDate.getHours() ||
      (currentHour === beginDate.getHours() &&
        currentMinute < beginDate.getMinutes())
    );
  });

  if (nextHourLabel) {
    return nextHourLabel.Id;
  }

  return null;
};

/**
 * Get the maximum number of nested items in each column
 * @param formattedTimetable
 */
export const getMaxNestedInColumn = (
  formattedTimetable: FormattedTimetable
): Record<number, number> => {
  const maxHoursRecord: Record<number, number> = {};

  Object.values(formattedTimetable.Days).forEach((day) => {
    Object.keys(day.Hours).forEach((hourKey) => {
      const hourNumber = parseInt(hourKey);
      const hourArray = day.Hours[hourNumber];

      // Update maxHoursRecord with the maximum length found so far for this hour
      maxHoursRecord[hourNumber] = Math.max(
        maxHoursRecord[hourNumber] || 0,
        hourArray?.length ?? 1
      );
    });
  });

  return maxHoursRecord;
};

/**
 * Calculate the width of each column, based on the maximum number of nested items in each column
 * @param rawWidths
 * @param colWidth
 */
export const calculateColWidths = (
  rawWidths: Record<number, number>,
  colWidth: number
): Record<number, number> => {
  const reducedWidths = Object.entries(rawWidths).reduce(
    (acc, [key, value]) => {
      acc[Number(key)] = value * colWidth;
      return acc;
    },
    {} as Record<number, number>
  );

  return reducedWidths;
};

export const getColOffset = (
  cols: Record<number, number>,
  colKey: number
): number => {
  return Object.keys(cols)
    .sort()
    .reduce((acc, key) => {
      if (Number(key) < colKey) {
        acc += cols[Number(key)];
      }

      return acc;
    }, 0);
};

export const isRowBlank = (
  dayHours: Record<number, FormattedTimetableHour[] | null>
): boolean => {
  return (
    dayHours == null ||
    Object.keys(dayHours).length === 0 ||
    Object.values(dayHours).every((hour) => hour == null || hour.length === 0)
  );
};
