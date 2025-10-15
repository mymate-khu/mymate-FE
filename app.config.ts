// app.config.ts
import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

const config: ExpoConfig = {
  name: 'mymate',
  slug: 'mymate',
  owner: 'yoonhojoon',
  // 필요한 설정들 ...
  android: {
    package: 'com.mymate.app',
    googleServicesFile: './google-services.json', // Firebase Android 설정 파일
  },
  ios: {
    googleServicesFile: './GoogleService-Info.plist', // Firebase iOS 설정 파일
  },
  plugins: [
    'expo-notifications',
  ],
  extra: {
    API_URL: process.env.API_URL,           // 필수
    STAGE: process.env.STAGE ?? 'dev',      // 'dev' | 'staging' | 'prod'
    SENTRY_DSN: process.env.SENTRY_DSN,     // 선택
    eas: { projectId: '412ab654-b934-4dd0-863b-21e7efb950b1' },
  },

};
export default config