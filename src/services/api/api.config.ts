// src/services/api/api.config.ts
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get API URL from environment variables with proper fallback
const getApiUrl = () => {
  // Try to get from expo extra config first
  const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;
  
  if (extraApiUrl) {
    console.log('✅ Using API URL from expo config:', extraApiUrl);
    return extraApiUrl;
  }

  // Fallback to hardcoded values based on environment
  if (__DEV__) {
    const fallbackUrl = Platform.select({
      android: 'http://192.168.1.104:3000',
      ios: 'http://192.168.1.104:3000',
      default: 'http://192.168.1.104:3000',
    });
    console.log('⚠️ Using fallback API URL:', fallbackUrl);
    return fallbackUrl;
  }

  console.log('🌐 Using production API URL');
  return 'https://api.vyn.com';
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 120000, // 2 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': Constants.expoConfig?.version || '1.0.0',
    'X-Platform': Platform.OS,
  },
};

// Log config on load
console.log('🔧 API Config loaded:', {
  BASE_URL: API_CONFIG.BASE_URL,
  PLATFORM: Platform.OS,
  TIMEOUT: API_CONFIG.TIMEOUT,
});

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESEND_OTP: '/api/auth/resend-verification',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_RESET_OTP: '/api/auth/verify-reset-otp',
    RESET_PASSWORD: '/api/auth/reset-password',
    GOOGLE_AUTH: '/api/auth/google',
  },
  
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile/update',
    CHANGE_PASSWORD: '/api/user/change-password',
    DELETE_ACCOUNT: '/api/user/delete-account',
  },
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