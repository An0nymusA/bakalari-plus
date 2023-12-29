import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageWrapper {
  static set(key: string, value: any): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  static async get(key: string): Promise<any | null> {
    return AsyncStorage.getItem(key).then((value) => {
      if (value == null) return null;
      return JSON.parse(value);
    });
  }

  static remove(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }

  static clear(): Promise<void> {
    return AsyncStorage.clear();
  }
}

export default StorageWrapper;
export {};
