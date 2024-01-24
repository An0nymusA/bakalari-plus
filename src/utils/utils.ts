import toastHelper from "./toastHelper";
import { onlineManager } from "@tanstack/react-query";
// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";

export const checkUrl = (url: string): boolean => {
  // const pattern =
  //   /^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?$/g;

  const pattern =
    /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})(\/[a-zA-Z0-9\-_\/]*)*$/;

  return pattern.test(url);
};

export const getMondayDate = (
  week: number = 0,
  originPoint?: string
): string => {
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

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const formatDate = (
  date: Date | string | number,
  type:
    | "date"
    | "weekday"
    | "fulldate"
    | "weekday-date"
    | "relative"
    | "weekday-full-date"
): string => {
  const parsedDate =
    typeof date == "string" || typeof date == "number" ? new Date(date) : date;

  const getParsedDate = () => {
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}.`;
  };

  const getFullDate = () => {
    const year = String(parsedDate.getFullYear());
    return `${getParsedDate()} ${year}`;
  };

  const getTime = () => {
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getWeekdayShort = () => {
    const weekdays = ["po", "út", "st", "čt", "pá", "so", "ne"];
    const weekdayNumber = parsedDate.getDay();
    return weekdays[weekdayNumber - 1];
  };

  const getWeekday = () => {
    const weekdays = [
      "Pondělí",
      "Úterý",
      "Středa",
      "Čtvrtek",
      "Pátek",
      "Sobota",
      "Neděle",
    ];

    return weekdays[parsedDate.getDay()];
  };

  switch (type) {
    case "date":
      return getParsedDate();
    case "fulldate":
      return getFullDate();
    case "weekday":
      return getWeekdayShort();
    case "weekday-date":
      return `${getWeekday()} ${getParsedDate()}`;
    case "weekday-full-date":
      return `${getWeekday()} ${getFullDate()}`;
    case "relative":
      return isToday(parsedDate) ? getTime() : getFullDate();
    default:
      return "";
  }
};

export const setOffline = (ignoreOnline: boolean = false) => {
  if (!ignoreOnline && onlineManager.isOnline())
    toastHelper.error("Nepodařilo se připojit k Bakalářům.");

  onlineManager.setOnline(false);
};

export const setOnline = (ignoreOffline: boolean = false) => {
  if (!ignoreOffline && !onlineManager.isOnline())
    toastHelper.success("Zpět online");

  onlineManager.setOnline(true);
};

export const isToday = (targetDate: Date | string): boolean => {
  if (typeof targetDate == "string") targetDate = new Date(targetDate);

  const currentDate = new Date();

  return (
    currentDate.getDate() === targetDate.getDate() &&
    currentDate.getMonth() === targetDate.getMonth() &&
    currentDate.getFullYear() === targetDate.getFullYear()
  );
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const roundPlaces = (num: number, places: number): number => {
  const multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier;
};

export const getLastNumericKey = <T>(obj: Record<number, T>): number => {
  const keys = Object.keys(obj);
  const lastKey = keys[keys.length - 1];

  return Number(lastKey);
};

export const stripHTMLTags = (str: string): string =>
  str
    .replace(/<br[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/^\s+/, "");

// export const sendNotification = (
//   title: string,
//   body: string = "",
//   data: Record<string, string> = {}
// ) => {
//   Notifications.scheduleNotificationAsync({
//     content: {
//       title,
//       body,
//       data,
//     },
//     trigger: {
//       seconds: 1,
//     },
//   });
// };

// export const requestNotificationsPermission = async () => {
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       lightColor: "#246CF9",
//     });
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus === "granted") return true;

//   const { status } = await Notifications.requestPermissionsAsync();
//   finalStatus = status;

//   return finalStatus ===
