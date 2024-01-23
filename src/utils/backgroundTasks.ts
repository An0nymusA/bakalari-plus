// import * as BackgroundFetch from "expo-background-fetch";
// import * as TaskManager from "expo-task-manager";

// import { requestNotificationsPermission } from "@utils/utils";
// import useLogger from "@hooks/useLogger";

// const { log } = useLogger("backgroundUpdate");

// export const BACKGROUND_FETCH_TASK = "background-update";

// export const registerBackgroundUpdate = async () => {
//   if (await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)) return;
//   await requestNotificationsPermission();

//   log.info(
//     "Registering background update task",
//     await BackgroundFetch.getStatusAsync()
//   );

//   await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//     minimumInterval: 60 * 1, // 1 minute
//     stopOnTerminate: false,
//     startOnBoot: true,
//   });
// };

// export const unregisterBackgroundUpdate = async () => {
//   log.info("Unregistering background update task");

//   return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
// };
