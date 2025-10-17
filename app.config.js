import 'dotenv/config';

export default {
  expo: {
    name: "Vyn",
    slug: "vyn-mobile",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "dark",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#111827"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.vyn.mobile"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#111827"
      },
      package: "com.vyn.mobile",
      usesCleartextTraffic: true
    },
    web: {},
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.104:3000',
      env: process.env.EXPO_PUBLIC_ENV || 'development',
    }
  }
};