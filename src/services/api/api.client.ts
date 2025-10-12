// src/services/api/api.client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, ERROR_MESSAGES, API_ENDPOINTS } from './api.config';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const TokenManager = {
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('@lingernote_access_token');
  },

  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem('@lingernote_access_token', token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem('@lingernote_refresh_token');
  },

  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem('@lingernote_refresh_token', token);
  },

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      '@lingernote_access_token',
      '@lingernote_refresh_token',
      '@lingernote_token_expiry',
    ]);
  },

  // NEW: Add refresh token method
  async refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.success && data.data.tokens) {
        // Store new tokens
        await this.setAccessToken(data.data.tokens.accessToken);
        await this.setRefreshToken(data.data.tokens.refreshToken);
        
        return data.data.tokens;
      }

      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  },
};

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

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

  private async getHeaders(includeAuth: boolean = true): Promise<HeadersInit> {
    const headers: HeadersInit = { ...API_CONFIG.HEADERS };

    if (includeAuth) {
      const token = await TokenManager.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        data
      );
    }

    return data;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true,
    isRetry: boolean = false
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = await this.getHeaders(includeAuth);
      const url = `${this.baseURL}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new ApiError(408, ERROR_MESSAGES.TIMEOUT_ERROR);
      }

      // Handle 401 with token refresh
      if (
        error instanceof ApiError &&
        error.status === 401 &&
        includeAuth &&
        !isRetry
      ) {
        if (this.isRefreshing) {
          // Wait for ongoing refresh
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(() => this.request<T>(endpoint, options, includeAuth, true));
        }

        this.isRefreshing = true;

        try {
          const tokens = await TokenManager.refreshAccessToken();
          
          if (tokens) {
            this.processQueue(null);
            return this.request<T>(endpoint, options, includeAuth, true);
          } else {
            throw new ApiError(401, 'Session expired. Please login again.');
          }
        } catch (refreshError) {
          this.processQueue(refreshError as ApiError);
          await TokenManager.clearTokens();
          throw new ApiError(401, 'Session expired. Please login again.');
        } finally {
          this.isRefreshing = false;
        }
      }

      if (error instanceof ApiError) {
        throw error;
      }

      if (!navigator.onLine) {
        throw new ApiError(0, ERROR_MESSAGES.NETWORK_ERROR);
      }

      throw new ApiError(500, ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, includeAuth);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      includeAuth
    );
  }

  async put<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      includeAuth
    );
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      includeAuth
    );
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, includeAuth);
  }
}

export const apiClient = new ApiClient();