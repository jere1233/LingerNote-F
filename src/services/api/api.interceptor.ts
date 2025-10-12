// src/services/api/api.interceptor.ts
import { ApiError, TokenManager, apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';

class RequestInterceptor {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  private processQueue(error: ApiError | null, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  async handleRequest<T>(
    requestFn: () => Promise<T>,
    includeAuth: boolean = true
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401 && includeAuth) {
        return this.handleUnauthorized(requestFn);
      }
      throw error;
    }
  }

  private async handleUnauthorized<T>(
    originalRequest: () => Promise<T>
  ): Promise<T> {
    if (this.isRefreshing) {
      // Wait for the current refresh to complete
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(() => originalRequest());
    }

    this.isRefreshing = true;

    try {
      const refreshToken = await TokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new ApiError(401, 'No refresh token available');
      }

      // Call refresh endpoint
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        throw new ApiError(401, 'Token refresh failed');
      }

      const data = await response.json();

      if (data.success && data.data.tokens) {
        // Store new tokens
        await TokenManager.setAccessToken(data.data.tokens.accessToken);
        await TokenManager.setRefreshToken(data.data.tokens.refreshToken);

        this.processQueue(null, data.data.tokens.accessToken);

        // Retry original request
        return originalRequest();
      }

      throw new ApiError(401, 'Invalid refresh response');
    } catch (error) {
      // Clear tokens and process queue with error
      await TokenManager.clearTokens();
      this.processQueue(error as ApiError, null);
      throw new ApiError(401, 'Session expired. Please login again.');
    } finally {
      this.isRefreshing = false;
    }
  }
}

export const requestInterceptor = new RequestInterceptor();