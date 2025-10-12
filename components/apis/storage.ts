// src/lib/storage.ts
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return await AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") { localStorage.setItem(key, value); return; }
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") { localStorage.removeItem(key); return; }
    await AsyncStorage.removeItem(key);
  },
};

// 사용자 ID 가져오기 (없으면 null 반환)
export const getMyId = async (): Promise<number | null> => {
  const value = await storage.getItem("userId");
  return value ? Number(value) : null;
};
