// import { BakalariApi } from "bakalari-ts-api";
// import { setupApi } from "@utils/authHelper";
// import { persistQueryClientSubscribe } from "@tanstack/react-query-persist-client";

// import { getMondayDate, sendNotification } from "@utils/utils";
// import useApiEndpoints from "@hooks/useApiEndpoints";
// import queryClient, { asyncStoragePersister } from "../api/queryClient";
// import { formatSenderName } from "../moduleUtils/KomensUtils";

// const queries = useApiEndpoints();

// const init = async (api: BakalariApi) => {
//   var updated = false;

//   const fetchData = async <T>(func: {
//     queryKey: string[];
//     queryFn: () => Promise<T | undefined>;
//     refetchInterval: number;
//     staleTime: number;
//   }): Promise<{ oldData: T; newData: Awaited<T> } | null> => {
//     const oldData = queryClient.getQueryData<T | null>(func.queryKey);
//     if (!oldData) return null;

//     const newData = await queryClient.fetchQuery(func);

//     if (!newData) return null;

//     return { newData, oldData };
//   };

//   const checkForUpdate = async <T>(
//     func: {
//       queryKey: string[];
//       queryFn: () => Promise<T | undefined>;
//     },
//     callback: (args: { oldData: T; newData: Awaited<T> }) => void
//   ) => {
//     const data = await fetchData({
//       ...func,
//       refetchInterval: 0,
//       staleTime: 0,
//     });
//     if (!data) return;

//     callback(data);
//   };

//   // |-------|
//   //   Marks
//   // |-------|
//   await checkForUpdate(queries.marks(api), ({ oldData, newData }) => {
//     const oldDataValues = Object.values(oldData.Date);
//     const newDataValues = Object.values(newData.Date);

//     if (
//       oldDataValues.length === newDataValues.length ||
//       oldDataValues.length == 0 ||
//       newDataValues.length == 0
//     )
//       return;

//     const newMarks = newDataValues.length - oldDataValues.length;
//     for (let i = 0; i < newMarks; i++) {
//       const mark = newDataValues[i];

//       sendNotification(
//         "Známka",
//         `${mark.MarkText} z předmětu ${mark.Subject.Name}: `,
//         {
//           url: "/modules/marks",
//         }
//       );
//     }

//     updated = true;
//   });

//   // |---------|
//   //   Kommens
//   // |---------|
//   await checkForUpdate(queries.komens(api), ({ oldData, newData }) => {
//     if (
//       oldData.length === newData.length ||
//       oldData.length == 0 ||
//       newData.length == 0
//     )
//       return;

//     const newMessages = newData.length - oldData.length;
//     for (let i = 0; i < newMessages; i++) {
//       const message = newData[i];

//       sendNotification(
//         "Komens",
//         `Zpráva od ${formatSenderName(message.Sender.Name)}`,
//         {
//           url: `/modules/komens/${message.Id}`,
//         }
//       );
//     }

//     updated = true;
//   });

//   // |-----------|
//   //   Timetable
//   // |-----------|
//   await checkForUpdate(
//     queries.timetable({ type: "actual", date: getMondayDate(0) }, api),
//     ({ oldData, newData }) => {
//       if (
//         Object.values(newData.Days).some((day) => day.DayInfo == null) ||
//         JSON.stringify(oldData) === JSON.stringify(newData)
//       )
//         return;

//       sendNotification("Rozvrh", `Došlo ke změně rozvrhu`, {
//         url: `/modules/timetable`,
//       });

//       updated = true;
//     }
//   );

//   !updated && sendNotification("Nothing new");
//   return updated;
// };

// const backgroundUpdate = async () => {
//   // persistQueryClientSubscribe({
//   //   queryClient: queryClient,
//   //   persister: asyncStoragePersister,
//   // });

//   // const api = await setupApi();

//   // if (api == null) {
//   //   return false;
//   // }

//   sendNotification("Checking", "", {
//     url: "/modules/marks",
//   });

//   return true;
// };

// export default backgroundUpdate;
