import SyncStorage from "sync-storage";

class StorageWrapper {
  static async init() {
    return SyncStorage.init();
  }

  static set(key: string, value: any): Promise<void> {
    return SyncStorage.set(key, value);
  }

  static get(key: string) {
    return SyncStorage.get(key);
  }

  static getObject(key: string) {
    const value = this.get(key);

    if (!value) return value;

    return JSON.parse(this.get(key));
  }

  static remove(key: string): Promise<void> {
    return SyncStorage.remove(key);
  }

  static clear(): Promise<void[]> {
    return Promise.all(
      SyncStorage.getAllKeys().map((key) => SyncStorage.remove(key))
    );
  }
}

export default StorageWrapper;
export {};
