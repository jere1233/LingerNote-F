// src/utils/errorHandler.ts
import { ApiError } from '../services/api/api.client';
import { ERROR_MESSAGES, HTTP_STATUS } from '../services/api/api.config';

export interface ErrorResponse {
  message: string;
  title?: string;
  action?: string;
  shouldLogout?: boolean;
}

export const handleApiError = (error: unknown): ErrorResponse => {
  // Network/Timeout errors
  if (error instanceof ApiError) {
    switch (error.status) {
      case 0:
        return {
          title: 'Connection Error',
          message: ERROR_MESSAGES.NETWORK_ERROR,
          action: 'Check Connection',
        };

      case HTTP_STATUS.UNAUTHORIZED:
        return {
          title: 'Session Expired',
          message: ERROR_MESSAGES.UNAUTHORIZED,
          action: 'Login Again',
          shouldLogout: true,
        };

      case HTTP_STATUS.FORBIDDEN:
        return {
          title: 'Access Denied',
          message: ERROR_MESSAGES.FORBIDDEN,
        };

      case HTTP_STATUS.NOT_FOUND:
        return {
          title: 'Not Found',
          message: ERROR_MESSAGES.NOT_FOUND,
        };

      case HTTP_STATUS.CONFLICT:
        return {
          title: 'Conflict',
          message: error.message || ERROR_MESSAGES.CONFLICT,
        };

      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return {
          title: 'Validation Error',
          message: error.message || ERROR_MESSAGES.VALIDATION_ERROR,
        };

      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return {
          title: 'Too Many Requests',
          message: ERROR_MESSAGES.RATE_LIMIT,
        };

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return {
          title: 'Server Error',
          message: ERROR_MESSAGES.SERVER_ERROR,
        };

      case 408:
        return {
          title: 'Request Timeout',
          message: ERROR_MESSAGES.TIMEOUT_ERROR,
        };

      default:
        return {
          title: 'Error',
          message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        };
    }
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      title: 'Error',
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    };
  }

  // Unknown errors
  return {
    title: 'Error',
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
  };
};

// Logging utility for production error tracking
export const logError = (
  error: unknown,
  context?: string,
  additionalData?: any
) => {
  if (__DEV__) {
    console.error('[Error]', context, error, additionalData);
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error, { contexts: { context, additionalData } });
  }
};

// Success message helper
export const getSuccessMessage = (action: string): string => {
  const messages: Record<string, string> = {
    login: 'Welcome back!',
    signup: 'Account created successfully!',
    logout: 'Logged out successfully',
    update_profile: 'Profile updated successfully',
    change_password: 'Password changed successfully',
    reset_password: 'Password reset successfully',
    verify_otp: 'Verification successful',
    resend_otp: 'Code sent successfully',
  };

  return messages[action] || 'Action completed successfully';
};