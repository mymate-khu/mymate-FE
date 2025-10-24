// app.config.ts
import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'mymate',
  slug: 'mymate',
  owner: 'yoonhojoon',

  icon: './assets/image/onboarding/MymateMainlogo.png', // 기본 앱 아이콘

  android: {
    package: 'com.mymate.app',
    googleServicesFile: './google-services.json', // Firebase Android 설정
    icon: './assets/image/onboarding/MymateMainlogo.png', // 안드로이드용 아이콘
    adaptiveIcon: {
      foregroundImage: './assets/image/onboarding/MymateMainlogo.png',
      backgroundColor: '#ffffff',
    },
  },

  ios: {
    googleServicesFile: './GoogleService-Info.plist', // Firebase iOS 설정
  },

  plugins: ['expo-notifications'],

  extra: {
    API_URL: process.env.API_URL,
    STAGE: process.env.STAGE ?? 'dev',
    SENTRY_DSN: process.env.SENTRY_DSN,
    eas: {
      projectId: '412ab654-b934-4dd0-863b-21e7efb950b1',
    },
  },
});
