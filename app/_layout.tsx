// app/_layout.tsx
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import * as Notifications from 'expo-notifications';
import FCMService from "../components/firebase/FCMService";

export default function Layout() {
  useEffect(() => {
    // 전역 알림 핸들러: 앱 시작 시 한 번만 등록
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // 앱 시작 시 FCM 서비스 초기화
    const initializeFCM = async () => {
      const fcmService = FCMService.getInstance();
      await fcmService.initialize();
      await fcmService.createNotificationChannel();
    };

    initializeFCM();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      
      {/* 상·좌·우 안전영역 적용. 하단 탭이 있으면 bottom은 제외 가능 */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "left", "right"]}>
        <Slot /> 
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
