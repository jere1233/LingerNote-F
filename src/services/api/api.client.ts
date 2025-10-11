// src/services/api/api.client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, ERROR_MESSAGES } from './api.config';

// Custom API Error class
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

// Token management
export const TokenManager = {
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('accessToken');
  },

  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem('accessToken', token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem('refreshToken');
  },

  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem('refreshToken', token);
  },

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  },
};

// API Client
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
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
    includeAuth: boolean = true
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
      if (error.name === 'AbortError') {
        throw new ApiError(408, ERROR_MESSAGES.TIMEOUT_ERROR);
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

  // HTTP Methods
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

// Export singleton instance
export const apiClient = new ApiClient();