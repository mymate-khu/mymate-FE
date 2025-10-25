// app/_layout.tsx
import React, { useEffect } from "react";
import { StatusBar, AppState, Platform, LogBox } from "react-native";
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

// 🔇 프로덕션에서만 로그/경고/에러 화면 숨기기
if (!__DEV__) {
  // RN 경고 전체 숨김 (노란 박스/로그)
  LogBox.ignoreAllLogs(true);

  // 콘솔 출력 막기 (필요 시 원하는 것만 막아도 됨)
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.error = noop;

  // 빨간 에러 화면(전역 JS 에러)도 막기 — 주의: 조용히 실패할 수 있음
  const g = globalThis as any;
  if (g?.ErrorUtils?.setGlobalHandler) {
    const prev = g.ErrorUtils.getGlobalHandler?.();
    g.ErrorUtils.setGlobalHandler((_err: any, _isFatal?: boolean) => {
      // TODO: Sentry/Crashlytics로 전송하려면 여기서 처리
      // prev?.(_err, _isFatal); // 기존 핸들러까지 호출하려면 주석 해제
    });
  }
}

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
        shouldShowAlert: true, // 포그라운드에서도 배너 보이게
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
