// app/_layout.tsx
import React, { useEffect } from "react";
import { StatusBar, AppState, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";

import * as Notifications from "expo-notifications";
import FCMService from "../components/firebase/FCMService";

import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";

// 전역 QueryClient (필요 시 옵션 조정)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30, // 30초
    },
  },
});

export default function Layout() {
  // 알림 핸들러 + FCM 초기화 (앱 시작 시 1회)
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const initializeFCM = async () => {
      const fcmService = FCMService.getInstance();
      await fcmService.initialize();
      await fcmService.createNotificationChannel();
    };

    initializeFCM();
  }, []);

  // 네트워크 온라인 상태 ↔ React Query 동기화
  useEffect(() => {
    if (Platform.OS !== "web") {
      const unsub = NetInfo.addEventListener((state) => {
        onlineManager.setOnline(!!state.isConnected);
      });
      return () => unsub();
    }
  }, []);

  // 앱 포커스 변화 시 refetch 동작
  useEffect(() => {
    const sub = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "left", "right"]}>
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
