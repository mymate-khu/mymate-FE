// FCMService.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import FirebaseConfig from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenReq } from '../apis/axiosInstance';

// 🔁 새 채널 ID (MAX 중요도로 생성)
const ANDROID_CHANNEL_ID = 'default-max';

class FCMService {
  private static instance: FCMService;
  private fcmToken: string | null = null;
  private listenersRegistered: boolean = false;
  private _detachOnMessage?: () => void; // 중복 리스너 방지용

  private constructor() {}

  public static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  /**
   * 알림 권한 요청
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
   * Expo Push Token(=서버용 푸시 토큰) 가져오기
   */
  async getFCMToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestNotificationPermission();
      if (!hasPermission) {
        console.log('알림 권한이 없어 FCM 토큰을 가져올 수 없습니다');
        return null;
      }

      const projectId =
        (Constants?.expoConfig as any)?.extra?.eas?.projectId ||
        process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

      const token = projectId
        ? await Notifications.getExpoPushTokenAsync({ projectId })
        : await Notifications.getExpoPushTokenAsync();

      if (token?.data) {
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
   * 메모리 보관 토큰 반환
   */
  getStoredToken(): string | null {
    return this.fcmToken;
  }

  /**
   * FCM 토큰 새로고침 리스너
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
        void this.sendTokenToServer(token);
      });
    } catch (error) {
      console.error('토큰 새로고침 리스너 설정 중 오류 발생:', error);
    }
  }

  /**
   * 서버에 푸시 토큰 전송
   */
  async sendTokenToServer(token: string): Promise<boolean> {
    try {
      const res = await TokenReq.post(
        '/api/notifications/push/token',
        {
          token,
          deviceType: Platform.OS, // 'ios' | 'android'
        },
        { timeout: 10000 }
      );
      console.log('✅ 토큰 전송 성공:', res.status, res.data);
      return true;
    } catch (err: any) {
      if (err.response) {
        console.error('❌ 서버 에러:', err.response.status, err.response.data);
      } else if (err.request) {
        console.error('🌐 네트워크 에러 또는 무응답:', err.message);
      } else {
        console.error('⚙️ 요청 구성 에러:', err.message);
      }
      return false;
    }
  }

  /**
   * 🔑 포그라운드 수신(onMessage) → 즉시 알림 표시
   */
  attachForegroundHandler() {
    try {
      const firebaseConfig = FirebaseConfig.getInstance();
      if (!firebaseConfig.isFirebaseInitialized()) {
        console.log('⚠️ Firebase가 초기화되지 않아 onMessage 핸들러를 붙일 수 없습니다');
        return () => {};
      }
      const messaging = firebaseConfig.getMessaging();

      const unsubscribe = messaging.onMessage(async (remoteMessage: any) => {
        const n = remoteMessage?.notification ?? {};
        const title = n.title ?? remoteMessage?.data?.title ?? '새 알림';
        const body = n.body ?? remoteMessage?.data?.body ?? '';

        // 즉시 표시
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: remoteMessage?.data ?? {},
            sound: 'default',
            // @ts-ignore (런타임에서 지원됨)
            channelId: ANDROID_CHANNEL_ID, // 안드로이드 채널 지정
          },
          trigger: null, // 즉시
        });
      });

      console.log('✅ 포그라운드 onMessage 핸들러 등록 완료');
      return unsubscribe;
    } catch (e) {
      console.warn('onMessage 핸들러 등록 실패:', e);
      return () => {};
    }
  }

  /**
   * 서비스 초기화
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 FCM 서비스 초기화 시작...');

      // Firebase init
      try {
        const firebaseOk = await FirebaseConfig.getInstance().initialize();
        if (!firebaseOk) {
          console.warn('⚠️ Firebase 초기화 실패: 메시징 기능이 제한될 수 있습니다');
        }
      } catch (e) {
        console.warn('⚠️ Firebase 초기화 예외:', e);
      }

      // Expo Notifications 설정
      await this.setupExpoNotifications();

      // 안드 채널 생성 (MAX)
      await this.createNotificationChannel();

      // Expo 리스너(표시된 알림/응답 로그용)
      await this.setupMessageListeners();

      // 포그라운드 수신 핸들러 (중복 방지)
      this._detachOnMessage?.();
      this._detachOnMessage = this.attachForegroundHandler();

      // 토큰 리프레시 리스너
      await this.setupTokenRefreshListener();

      // 초기 토큰 획득 & 저장
      const token = await this.getFCMToken();
      if (token) {
        await AsyncStorage.setItem('FCMtoken', token);
        // 필요 시 서버 전송
        // await this.sendTokenToServer(token);
      }

      console.log('✅ FCM 서비스 초기화 완료');
    } catch (error) {
      console.error('FCM 서비스 초기화 중 오류 발생:', error);
    }
  }

  /**
   * Expo Notifications 기본 설정(전역 setNotificationHandler는 _layout.tsx에서 1회만)
   */
  async setupExpoNotifications(): Promise<void> {
    try {
      console.log('✅ Expo Notifications 기본 설정 확인');
    } catch (error) {
      console.error('Expo Notifications 설정 중 오류 발생:', error);
    }
  }

  /**
   * Expo Notifications 리스너(이미 표시된 알림과 응답 이벤트만 로깅)
   * ⛔ 여기서 presentNotificationAsync 같은 "재표시"는 하지 않음
   */
  async setupMessageListeners(): Promise<void> {
    try {
      if (this.listenersRegistered) {
        console.log('ℹ️ 알림 리스너가 이미 등록되어 있습니다');
        return;
      }

      const notificationListener =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log('📱 알림 수신(이미 표시됨):', notification);
        });

      const responseListener =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log('📱 알림 응답:', response);
        });

      console.log('✅ Expo Notifications 리스너 설정 완료');
      this.listenersRegistered = true;

      // 필요 시 어딘가에서 해제하려면 저장해두고 remove 호출
      // Notifications.removeNotificationSubscription(notificationListener)
      // Notifications.removeNotificationSubscription(responseListener)
    } catch (error) {
      console.error('메시지 리스너 설정 중 오류 발생:', error);
    }
  }

  /**
   * 안드로이드 채널 생성 (MAX)
   */
  async createNotificationChannel(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
          name: '기본 알림 (MAX)',
          description: '앱의 기본 알림 채널입니다',
          importance: Notifications.AndroidImportance.HIGH, // ✅ MAX
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
          enableVibrate: true,
          enableLights: true,
          bypassDnd: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        } as any);
        console.log('✅ 알림 채널 생성 완료 (MAX)');
      }
    } catch (error) {
      console.error('알림 채널 생성 중 오류 발생:', error);
    }
  }

  /**
   * 로컬 알림 표시 유틸
   */
  async displayNotification(title: string, body: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          // @ts-ignore
          channelId: ANDROID_CHANNEL_ID,
        },
        trigger: null,
      });
      console.log('✅ 로컬 알림 표시 완료');
    } catch (error) {
      console.error('로컬 알림 표시 중 오류 발생:', error);
    }
  }
}

export default FCMService;
