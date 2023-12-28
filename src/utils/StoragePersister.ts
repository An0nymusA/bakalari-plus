import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

import StorageWrapper from "./storage";

export default function createStoragePersister(
  idbValidKey: IDBValidKey = "reactQuery"
) {
  return {
    persistClient: (client: PersistedClient) => {
      StorageWrapper.set(`${idbValidKey}`, client);
    },
    restoreClient: () => {
      return StorageWrapper.get(`${idbValidKey}`);
    },
    removeClient: () => {
      StorageWrapper.remove(`${idbValidKey}`);
    },
  } as Persister;
}
