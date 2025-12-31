import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'stm32',
  webDir: 'dist',
  server: {
    // 允许应用访问外部URL
    allowNavigation: ['*'],
    // 允许HTTP请求（用于开发环境）
    cleartext: true
  },
  plugins: {
    // HTTP插件配置，允许网络请求
    CapacitorHttp: {
      enabled: true
    }
  },
  // Android特定配置
  android: {
    // 允许HTTP流量（Android 9+默认禁用HTTP）
    allowMixedContent: true,
    // 网络安全配置
    useCleartextTraffic: true
  }
};

export default config;
