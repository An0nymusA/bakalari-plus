import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { AttachmentInfo } from "bakalari-ts-api";
import useBakalariStore from "../hooks/useBakalariStore";
import toastHelper from "../utils/toastHelper";

/**
 * Downloads attachment and opens it in default app
 * @param attachment
 * @returns
 */
export const download = async (
  attachment: AttachmentInfo,
  onlineStatus: boolean
) => {
  const fileInfo = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory + attachment.Name
  );
  let uri = fileInfo.uri;

  if (!uri && !onlineStatus) {
    return toastHelper.error("Příloha není stažena");
  }

  if (!uri) {
    const api = useBakalariStore.getState().api;

    if (!(api && api.connector)) return;

    const downloadResumable = await FileSystem.downloadAsync(
      api.attachmentUrl(attachment.Id),
      FileSystem.documentDirectory + attachment.Name,
      { headers: api.connector.getAuthHeader() }
    );

    uri = downloadResumable.uri;
  }

  toastHelper.hide();
  FileSystem.getContentUriAsync(uri).then((cUri) => {
    IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: cUri,
      flags: 1,
      type: attachment.Type,
    });
  });
};

export const formatSenderName = (name: string) => {
  return name.replace("(ředitelství)", "");
};
