// app.config.ts
import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const profile = process.env.EAS_BUILD_PROFILE;
  const isPreview = profile === 'preview';

  return {
    ...config,
    name: 'mymate',
    slug: 'mymate',
    extra: {
      ...config.extra,
      API_URL: process.env.API_URL,
      STAGE: process.env.STAGE ?? 'dev',
      SENTRY_DSN: process.env.SENTRY_DSN,
      eas: {
        ...(config.extra?.eas ?? {}),
        projectId: 'ada93026-57fb-419f-a272-59fd9079c15b',
      },
    },
    android: {
      package: isPreview ? 'com.kimseungwon.mymate.preview' : 'com.kimseungwon.mymate',
      versionCode: isPreview ? 1 : 1,
      // ⛔ 여기엔 usesCleartextTraffic 직접 넣지 마세요(타입 에러 원인)
    },
    plugins: [
      // 👇 여기서 네이티브 빌드 속성 주입
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: process.env.API_URL?.startsWith('http://') ? true : false,
          },
        },
      ],
    ],
  };
};
