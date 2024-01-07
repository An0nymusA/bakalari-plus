import { FormattedTimetable } from "bakalari-ts-api";
import toastHelper from "./toastHelper";
import { onlineManager } from "@tanstack/react-query";

const checkUrl = (url: string): boolean => {
  // const pattern =
  //   /^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?$/g;

  const pattern =
    /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})(\/[a-zA-Z0-9\-_\/]*)*$/;

  return pattern.test(url);
};

const getMondayDate = (week: number = 0, originPoint?: string): string => {
  const currentDate = originPoint ? new Date(originPoint) : new Date();
  const currentDay = currentDate.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  const mondayDate = new Date(
    currentDate.setDate(currentDate.getDate() + (diff + 7 * week))
  );
  const year = mondayDate.getFullYear();
  const month = String(mondayDate.getMonth() + 1).padStart(2, "0");
  const day = String(mondayDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const formatDate = (date: Date | string, type: "date" | "weekday"): string => {
  if (typeof date == "string") {
    date = new Date(date);
  }

  if (type === "date") {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}`;
  } else if (type === "weekday") {
    const weekdays = ["po", "út", "st", "čt", "pá", "so", "ne"];
    const weekdayNumber = date.getDay();
    return weekdays[weekdayNumber - 1];
  }

  return "";
};

const setOffline = (ignoreOnline: boolean = false) => {
  if (!ignoreOnline && onlineManager.isOnline())
    toastHelper.error("Nepodařilo se připojit k Bakalářům.");

  onlineManager.setOnline(false);
};

const getMaxHoursPerDay = (
  formattedTimetable: FormattedTimetable
): Record<number, number> => {
  const maxHoursRecord: Record<number, number> = {};

  Object.values(formattedTimetable.days).forEach((day) => {
    Object.keys(day.hours).forEach((hourKey) => {
      const hourNumber = parseInt(hourKey);
      const hourArray = day.hours[hourNumber];

      // Update maxHoursRecord with the maximum length found so far for this hour
      maxHoursRecord[hourNumber] = Math.max(
        maxHoursRecord[hourNumber] || 0,
        hourArray?.length ?? 1
      );
    });
  });

  return maxHoursRecord;
};

export {
  checkUrl,
  getMondayDate,
  setOffline,
  getWeekNumber,
  formatDate,
  getMaxHoursPerDay,
};
