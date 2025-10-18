// src/services/api/auth.api.ts
import { apiClient, TokenManager, ApiError } from './api.client';
import { API_ENDPOINTS } from './api.config';

// Type definitions
export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
    requiresVerification?: boolean;
    verificationType?: 'email' | 'phone';
  };
}

export interface SignupRequest {
  fullName: string;
  emailOrPhone: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    requiresVerification: boolean;
    verificationType: 'email' | 'phone';
  };
}

export interface VerifyOTPRequest {
  emailOrPhone: string;
  otp: string;
  isSignup?: boolean;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface ForgotPasswordRequest {
  emailOrPhone: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: {
    resetId: string;
  };
}

export interface VerifyResetOTPRequest {
  emailOrPhone: string;
  otp: string;
}

export interface VerifyResetOTPResponse {
  success: boolean;
  message: string;
  data: {
    resetToken: string;
  };
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResendOTPRequest {
  emailOrPhone: string;
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    isNewUser: boolean;
    provider: string;
  };
}

export interface User {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
  status: string;
  role?: string;
  provider?: string;
}

// Auth API Service
export class AuthAPI {
  /**
   * Login user with email/phone and password
   */
  static async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data,
        false // Don't include auth token for login
      );

      // Store tokens if login successful and verification not required
      if (response.success && response.data.tokens && !response.data.requiresVerification) {
        await TokenManager.setAccessToken(response.data.tokens.accessToken);
        await TokenManager.setRefreshToken(response.data.tokens.refreshToken);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Login failed. Please try again.');
    }
  }

  /**
   * Register new user
   */
  static async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await apiClient.post<SignupResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        data,
        false
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Signup failed. Please try again.');
    }
  }

  /**
   * Verify OTP for login or signup
   */
  static async verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      const response = await apiClient.post<VerifyOTPResponse>(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        data,
        false
      );

      // Store tokens if verification successful
      if (response.success && response.data.tokens) {
        await TokenManager.setAccessToken(response.data.tokens.accessToken);
        await TokenManager.setRefreshToken(response.data.tokens.refreshToken);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'OTP verification failed. Please try again.');
    }
  }

  /**
   * Resend OTP code
   */
  static async resendOTP(data: ResendOTPRequest): Promise<ResendOTPResponse> {
    try {
      const response = await apiClient.post<ResendOTPResponse>(
        API_ENDPOINTS.AUTH.RESEND_OTP,
        data,
        false
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to resend OTP. Please try again.');
    }
  }

  /**
   * Request password reset (sends OTP)
   */
  static async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    try {
      const response = await apiClient.post<ForgotPasswordResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        data,
        false
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to send reset code. Please try again.');
    }
  }

  /**
   * Verify OTP for password reset
   */
  static async verifyResetOTP(
    data: VerifyResetOTPRequest
  ): Promise<VerifyResetOTPResponse> {
    try {
      const response = await apiClient.post<VerifyResetOTPResponse>(
        API_ENDPOINTS.AUTH.VERIFY_RESET_OTP,
        data,
        false
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'OTP verification failed. Please try again.');
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    try {
      const response = await apiClient.post<ResetPasswordResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        data,
        false
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to reset password. Please try again.');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        data,
        false
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to refresh token. Please try again.');
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, true);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Always clear local tokens
      await TokenManager.clearTokens();
    }
  }

  /**
   * Google OAuth authentication
   * Sends Google ID token to backend for verification
   * Returns user data and tokens on success
   */
  static async googleAuth(data: GoogleAuthRequest): Promise<GoogleAuthResponse> {
    try {
      const response = await apiClient.post<GoogleAuthResponse>(
        API_ENDPOINTS.AUTH.GOOGLE_AUTH,
        data,
        false // Don't include auth token for Google auth
      );

      // Store tokens if authentication successful
      if (response.success && response.data.tokens) {
        await TokenManager.setAccessToken(response.data.tokens.accessToken);
        await TokenManager.setRefreshToken(response.data.tokens.refreshToken);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Google authentication failed. Please try again.');
    }
  }
}

// Export for convenience
export default AuthAPI;