// app.config.ts
import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'mymate',
  slug: 'mymate',
  // 필요한 설정들 ...
  extra: {
    API_URL: process.env.API_URL,           // 필수
    STAGE: process.env.STAGE ?? 'dev',      // 'dev' | 'staging' | 'prod'
    SENTRY_DSN: process.env.SENTRY_DSN,     // 선택
  },
};

export default config;
