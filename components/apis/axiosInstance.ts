// src/lib/TokenReq.ts
import axios, { AxiosInstance, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { API_URL as ENV_API_URL } from "@env";

// 공용 스토리지 래퍼
const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return await AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") localStorage.setItem(key, value);
    else await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") localStorage.removeItem(key);
    else await AsyncStorage.removeItem(key);
  },
};

// baseURL: Expo extra → .env
const baseURL =
  (Constants.expoConfig?.extra as any)?.API_URL ??
  ENV_API_URL;


const TokenReq: AxiosInstance = axios.create({
  baseURL,
  headers: { accept: "application/json" },
  withCredentials: Platform.OS === "web",
});

// 요청 인터셉터
TokenReq.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await storage.getItem("accessToken");

  // AxiosHeaders.from으로 안전하게 변환
  const headers = AxiosHeaders.from(config.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  config.headers = headers;
  return config;
});

// 응답 인터셉터
TokenReq.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await storage.removeItem("accessToken");
      await storage.removeItem("refreshToken");

      if (Platform.OS === "web") {
        window.location.href = "/";
      } else {
        // React Native → expo-router 라우터 사용
        // import { router } from "expo-router";
        // router.replace("/(auth)/login");
        console.warn("401 Unauthorized: redirect to login");
      }
    }
    return Promise.reject(error);
  }
);

export { TokenReq, storage };
