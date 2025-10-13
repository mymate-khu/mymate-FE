// app/_layout.tsx
import React, { useEffect } from "react";
import { StatusBar, AppState, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";

import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";

// 전역 QueryClient (필요시 옵션 조정)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,              // 실패 시 1회 재시도
      staleTime: 1000 * 30,  // 30초 동안 신선
    },
  },
});

export default function Layout() {
  // 네이티브에서 네트워크 연결 상태 ↔ React Query 동기화 (선택)
  useEffect(() => {
    if (Platform.OS !== "web") {
      const unsub = NetInfo.addEventListener((state) => {
        onlineManager.setOnline(!!state.isConnected);
      });
      return () => unsub();
    }
  }, []);

  // 앱 포커스 변화시 refetch 동작하도록 설정 (선택)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />

      {/* 상·좌·우 안전영역 적용. 하단 탭이 있으면 bottom은 제외 가능 */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "left", "right"]}>
        {/* ✅ 전역 React Query Provider */}
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}