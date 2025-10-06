import { initializeApp, getApp } from '@react-native-firebase/app';
import { getMessaging } from '@react-native-firebase/messaging';

// Firebase 설정을 환경변수에서 가져오기
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || `https://${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
};

class FirebaseConfig {
  private static instance: FirebaseConfig;
  private app: any;
  private messaging: any;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): FirebaseConfig {
    if (!FirebaseConfig.instance) {
      FirebaseConfig.instance = new FirebaseConfig();
    }
    return FirebaseConfig.instance;
  }

  /**
   * Firebase 설정이 올바른지 검증합니다
   */
  private validateFirebaseConfig(): boolean {
    const requiredFields = [
      'EXPO_PUBLIC_FIREBASE_API_KEY',
      'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
      'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'EXPO_PUBLIC_FIREBASE_APP_ID'
    ];

    const missingFields = requiredFields.filter(field => !process.env[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Firebase 환경변수가 누락되었습니다:', missingFields);
      console.log('📝 .env 파일에 다음 환경변수를 추가하세요:');
      missingFields.forEach(field => {
        console.log(`   ${field}=your-${field.toLowerCase().replace('expo_public_firebase_', '').replace('_', '-')}`);
      });
      console.log('💡 databaseURL은 선택사항이며, 자동으로 생성됩니다.');
      return false;
    }

    return true;
  }

  /**
   * Firebase를 초기화합니다
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        console.log('Firebase가 이미 초기화되었습니다');
        return true;
      }

      console.log('🔥 Firebase 초기화 시작...');

      // Firebase 설정 검증
      if (!this.validateFirebaseConfig()) {
        throw new Error('Firebase 설정이 올바르지 않습니다');
      }

      // 이미 초기화된 앱이 있는지 확인
      try {
        this.app = getApp();
        console.log('기존 Firebase 앱을 사용합니다');
      } catch (error) {
        // 앱이 없으면 새로 초기화
        console.log('새 Firebase 앱을 초기화합니다');
        this.app = initializeApp(firebaseConfig);
      }
      
      // Firebase Messaging 초기화
      this.messaging = getMessaging(this.app);

      this.isInitialized = true;
      console.log('✅ Firebase 초기화 완료');
      return true;
    } catch (error) {
      console.error('❌ Firebase 초기화 실패:', error);
      return false;
    }
  }

  /**
   * Firebase 앱 인스턴스를 반환합니다
   */
  getApp(): any {
    if (!this.isInitialized) {
      throw new Error('Firebase가 초기화되지 않았습니다. initialize()를 먼저 호출하세요.');
    }
    return this.app;
  }

  /**
   * Firebase Messaging 인스턴스를 반환합니다
   */
  getMessaging(): any {
    if (!this.isInitialized) {
      throw new Error('Firebase가 초기화되지 않았습니다. initialize()를 먼저 호출하세요.');
    }
    return this.messaging;
  }

  /**
   * 초기화 상태를 확인합니다
   */
  isFirebaseInitialized(): boolean {
    return this.isInitialized;
  }
}

export default FirebaseConfig;
