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

const setOffline = () => {
  if (onlineManager.isOnline())
    toastHelper.error("Nepodařilo se připojit k Bakalářům.");

  onlineManager.setOnline(false);
};

export { checkUrl, getMondayDate, setOffline };
