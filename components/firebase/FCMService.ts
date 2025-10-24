import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import FirebaseConfig from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { TokenReq } from '../apis/axiosInstance';

const ANDROID_CHANNEL_ID = 'default';

class FCMService {
  private static instance: FCMService;
  private fcmToken: string | null = null;
  private listenersRegistered: boolean = false;

  private constructor() { }

  public static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  /**
   * 알림 권한을 요청합니다
   */
  async requestNotificationPermission(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        console.log('✅ 알림 권한이 허용되었습니다');
        return true;
      } else {
        console.log('❌ 알림 권한이 거부되었습니다');
        return false;
      }
    } catch (error) {
      console.error('알림 권한 요청 중 오류 발생:', error);
      return false;
    }
  }

  /**
   * FCM 토큰을 가져옵니다 (Expo Push Token 사용)
   */
  async getFCMToken(): Promise<string | null> {
    try {
      // 권한 확인
      const hasPermission = await this.requestNotificationPermission();
      if (!hasPermission) {
        console.log('알림 권한이 없어 FCM 토큰을 가져올 수 없습니다');
        return null;
      }

      // Expo Push Token 가져오기 (EAS Project ID 사용)
      const projectId =
        (Constants?.expoConfig as any)?.extra?.eas?.projectId ||
        process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

      const token = projectId
        ? await Notifications.getExpoPushTokenAsync({ projectId })
        : await Notifications.getExpoPushTokenAsync();

      if (token && token.data) {
        this.fcmToken = token.data;
        console.log('✅ Expo Push 토큰 발급 성공');
        console.log('📋 EAS Project ID:', projectId ?? 'auto-linked/undefined');
        console.log('🔑 토큰:', token.data);
        return token.data;
      } else {
        console.log('❌ Expo Push 토큰 발급 실패');
        console.log('📋 EAS Project ID:', projectId ?? 'auto-linked/undefined');
        return null;
      }
    } catch (error) {
      console.error('Expo Push 토큰 가져오기 중 오류 발생:', error);
      return null;
    }
  }

  /**
   * 저장된 FCM 토큰을 반환합니다
   */
  getStoredToken(): string | null {
    return this.fcmToken;
  }

  /**
   * FCM 토큰 새로고침 리스너를 설정합니다
   */
  async setupTokenRefreshListener(): Promise<void> {
    try {
      const firebaseConfig = FirebaseConfig.getInstance();
      if (!firebaseConfig.isFirebaseInitialized()) {
        console.log('⚠️ Firebase가 초기화되지 않아 토큰 새로고침 리스너를 설정할 수 없습니다');
        return;
      }

      const messaging = firebaseConfig.getMessaging();

      messaging.onTokenRefresh((token: string) => {
        console.log('🔄 FCM 토큰이 새로고침되었습니다:', token);
        this.fcmToken = token;
        // 여기서 서버에 새로운 토큰을 전송할 수 있습니다
        this.sendTokenToServer(token);
      });
    } catch (error) {
      console.error('토큰 새로고침 리스너 설정 중 오류 발생:', error);
    }
  }

  /**
   * 서버에 FCM 토큰을 전송합니다
   */
  async sendTokenToServer(token: string): Promise<boolean> {
  try {
    const res = await TokenReq.post(
      "/api/notifications/push/token",
      {
        token: token,          // 서버가 기대하는 필드명 확인!
        deviceType: Platform.OS,    // 'ios' | 'android'
      },
      {
        // 필요 시 커스텀 헤더 추가 (보통 Axios 인스턴스가 자동으로 JSON 헤더 셋업함)
        // headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );

    // 디버깅에 도움 되는 로그
    console.log("✅ 토큰 전송 성공:", res.status, res.data);
    return true;
  } catch (err: any) {
    if (err.response) {
      // 서버가 4xx/5xx 응답을 보낸 경우
      console.error("❌ 서버 에러:", err.response.status, err.response.data);
    } else if (err.request) {
      // 요청은 갔지만 응답을 못 받은 경우 (네트워크)
      console.error("🌐 네트워크 에러 또는 무응답:", err.message);
    } else {
      // 요청 구성 중 에러
      console.error("⚙️ 요청 구성 에러:", err.message);
    }
    return false;
  }
}

  /**
   * FCM 서비스를 초기화합니다
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 FCM 서비스 초기화 시작...');

      // Firebase 먼저 초기화 (토큰 새로고침/메시징 사용을 위해 필수)
      try {
        const firebaseOk = await FirebaseConfig.getInstance().initialize();
        if (!firebaseOk) {
          console.warn('⚠️ Firebase 초기화 실패: 메시징 기능이 제한될 수 있습니다');
        }
      } catch (e) {
        console.warn('⚠️ Firebase 초기화 예외:', e);
      }

      // 프로젝트 ID 로그 출력
      const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
      console.log('📋 프로젝트 ID:', projectId);

      // Expo Notifications 설정
      await this.setupExpoNotifications();

      // Android 알림 채널 생성 (필수)
      await this.createNotificationChannel();

      // 토큰 새로고침 리스너 설정
      await this.setupTokenRefreshListener();

      // 메시지 수신 리스너 설정
      await this.setupMessageListeners();

      // 초기 토큰 가져오기
      const token = await this.getFCMToken();
      if (token) {
        await AsyncStorage.setItem("FCMtoken", token);
      }

      // if (token) {
      //   console.log('🪪 서버 전송 예정 토큰(Expo/FCM):', token);
      //   // 서버에 토큰 전송
      //   await this.sendTokenToServer(token);
      // }

      console.log('✅ FCM 서비스 초기화 완료');
      console.log('📋 사용된 프로젝트 ID:', projectId);
    } catch (error) {
      console.error('FCM 서비스 초기화 중 오류 발생:', error);
    }
  }

  /**
   * Expo Notifications 설정
   */
  async setupExpoNotifications(): Promise<void> {
    try {
      // 전역(App 루트)에서 setNotificationHandler를 1회만 등록합니다.
      console.log('✅ Expo Notifications 기본 설정 확인');
    } catch (error) {
      console.error('Expo Notifications 설정 중 오류 발생:', error);
    }
  }

  /**
   * FCM 메시지 수신 리스너를 설정합니다
   */
  async setupMessageListeners(): Promise<void> {
    try {
      if (this.listenersRegistered) {
        console.log('ℹ️ 알림 리스너가 이미 등록되어 있습니다');
        return;
      }
      // Expo Notifications 리스너 설정
      const notificationListener = Notifications.addNotificationReceivedListener(async (notification) => {
        console.log('📱 알림 수신:', notification);
        // 앱이 포그라운드인 경우 배너가 안 뜨는 기기/환경을 대비해 즉시 표시
        try {
          const content = notification.request?.content ?? {} as any;
          await Notifications.presentNotificationAsync({
            title: content.title ?? '알림',
            body: content.body ?? (content.data ? JSON.stringify(content.data) : ''),
            sound: true,
            // Android 채널 강제 지정
            channelId: ANDROID_CHANNEL_ID,
          } as any);
        } catch (e) {
          console.warn('포그라운드 재표시 실패:', e);
        }
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('📱 알림 응답:', response);
      });

      console.log('✅ Expo Notifications 리스너 설정 완료');
      this.listenersRegistered = true;

      // 컴포넌트 언마운트 시 리스너 정리 (선택사항)
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    } catch (error) {
      console.error('메시지 리스너 설정 중 오류 발생:', error);
    }
  }

  /**
   * 알림 채널을 생성합니다 (Android)
   */
  async createNotificationChannel(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
          name: '기본 알림(High)',
          description: '앱의 기본 알림 채널입니다',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
          enableVibrate: true,
          enableLights: true,
        } as any);
        console.log('✅ 알림 채널 생성 완료');
      }
    } catch (error) {
      console.error('알림 채널 생성 중 오류 발생:', error);
    }
  }

  /**
   * 로컬 알림을 표시합니다
   */
  async displayNotification(title: string, body: string): Promise<void> {
    try {
      const trigger = Platform.OS === 'android'
        ? { channelId: ANDROID_CHANNEL_ID as const }
        : null;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger,
      });

      console.log('✅ 로컬 알림 표시 완료');
    } catch (error) {
      console.error('로컬 알림 표시 중 오류 발생:', error);
    }
  }
}

export default FCMService;
