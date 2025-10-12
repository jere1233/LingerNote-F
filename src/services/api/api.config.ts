// src/services/api/api.config.ts
import Constants from 'expo-constants';

const ENV = Constants.expoConfig?.extra?.env || 'development';

// Get API URL from environment variables
const getApiUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (envUrl) {
    return envUrl;
  }

  // Fallback based on __DEV__
  if (__DEV__) {
    // For Android emulator, use 10.0.2.2
    // For iOS simulator, use localhost
    // For physical device, use your computer's IP
    return Platform.select({
      android: 'http://10.0.2.2:3000/api',
      ios: 'http://localhost:3000/api',
      default: 'http://localhost:3000/api',
    });
  }

  return 'https://api.lingernote.com/api';
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': Constants.expoConfig?.version || '1.0.0',
    'X-Platform': Platform.OS,
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_RESET_OTP: '/auth/verify-reset-otp',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE_AUTH: '/auth/google',
  },
  
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/delete-account',
  },

  // Add more as needed
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request took too long. Please try again.',
  SERVER_ERROR: 'Server error. Our team has been notified.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'This action conflicts with existing data.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
};

// HTTP Status Code Helpers
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

import { Platform } from 'react-native';