// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import AuthAPI from '../services/api/auth.api';
import { TokenManager } from '../services/api/api.client';

interface User {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  isVerified: boolean;
  status: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<any>;
  signup: (fullName: string, emailOrPhone: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  USER: '@lingernote_user',
  ACCESS_TOKEN: '@lingernote_access_token',
  REFRESH_TOKEN: '@lingernote_refresh_token',
  TOKEN_EXPIRY: '@lingernote_token_expiry',
  LAST_ACTIVITY: '@lingernote_last_activity',
} as const;

// Token refresh configuration
const TOKEN_CONFIG = {
  REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh 5 minutes before expiry
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes of inactivity
  CHECK_INTERVAL: 60 * 1000, // Check every minute
} as const;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
    
    // Set up app state listener for background/foreground handling
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
      clearTimers();
    };
  }, []);

  // Set up token refresh timer when user is authenticated
  useEffect(() => {
    if (user && !isRefreshing) {
      setupTokenRefreshTimer();
      setupActivityMonitoring();
    } else {
      clearTimers();
    }
    
    return () => clearTimers();
  }, [user, isRefreshing]);

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      const [accessToken, storedUser, lastActivity] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY),
      ]);

      if (!accessToken || !storedUser) {
        setIsLoading(false);
        return;
      }

      // Check session timeout
      if (lastActivity) {
        const inactiveTime = Date.now() - parseInt(lastActivity, 10);
        if (inactiveTime > TOKEN_CONFIG.SESSION_TIMEOUT) {
          console.log('Session expired due to inactivity');
          await clearAuthData();
          setIsLoading(false);
          return;
        }
      }

      // Parse and set user
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Check if token needs refresh
      const shouldRefresh = await checkTokenExpiry();
      if (shouldRefresh) {
        await refreshSession();
      }

      // Update last activity
      await updateLastActivity();
      
    } catch (error) {
      console.error('Error initializing auth:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle app state changes (foreground/background)
   */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // App coming to foreground
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      if (user) {
        const lastActivity = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
        
        if (lastActivity) {
          const inactiveTime = Date.now() - parseInt(lastActivity, 10);
          
          // Session timeout
          if (inactiveTime > TOKEN_CONFIG.SESSION_TIMEOUT) {
            console.log('Session expired, logging out');
            await logout();
            return;
          }
        }

        // Check token and refresh if needed
        const shouldRefresh = await checkTokenExpiry();
        if (shouldRefresh) {
          await refreshSession();
        }
        
        await updateLastActivity();
      }
    }
    
    // App going to background
    if (nextAppState.match(/inactive|background/)) {
      await updateLastActivity();
    }

    appStateRef.current = nextAppState;
  };

  /**
   * Check if token is close to expiry
   */
  const checkTokenExpiry = async (): Promise<boolean> => {
    try {
      const expiryStr = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      if (!expiryStr) return false;

      const expiryTime = parseInt(expiryStr, 10);
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      // Refresh if token expires within threshold
      return timeUntilExpiry <= TOKEN_CONFIG.REFRESH_THRESHOLD;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return false;
    }
  };

  /**
   * Set up automatic token refresh timer
   */
  const setupTokenRefreshTimer = async () => {
    clearTimers();

    const expiryStr = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!expiryStr) return;

    const expiryTime = parseInt(expiryStr, 10);
    const currentTime = Date.now();
    const refreshTime = expiryTime - TOKEN_CONFIG.REFRESH_THRESHOLD;
    const timeUntilRefresh = Math.max(0, refreshTime - currentTime);

    refreshTimerRef.current = setTimeout(async () => {
      await refreshSession();
    }, timeUntilRefresh);
  };

  /**
   * Set up activity monitoring
   */
  const setupActivityMonitoring = () => {
    if (activityTimerRef.current) {
      clearInterval(activityTimerRef.current);
    }

    activityTimerRef.current = setInterval(async () => {
      const lastActivity = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
      
      if (lastActivity) {
        const inactiveTime = Date.now() - parseInt(lastActivity, 10);
        
        if (inactiveTime > TOKEN_CONFIG.SESSION_TIMEOUT) {
          console.log('Session timeout due to inactivity');
          await logout();
        }
      }
    }, TOKEN_CONFIG.CHECK_INTERVAL);
  };

  /**
   * Clear all timers
   */
  const clearTimers = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (activityTimerRef.current) {
      clearInterval(activityTimerRef.current);
      activityTimerRef.current = null;
    }
  };

  /**
   * Update last activity timestamp
   */
  const updateLastActivity = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_ACTIVITY,
        Date.now().toString()
      );
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  };

  /**
   * Refresh authentication session
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) return false;

    try {
      setIsRefreshing(true);
      
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        await logout();
        return false;
      }

      // Call refresh token API endpoint
      const newTokens = await TokenManager.refreshAccessToken();
      
      if (newTokens) {
        // Store new tokens and expiry
        await storeTokens(newTokens.accessToken, newTokens.refreshToken);
        await updateLastActivity();
        return true;
      } else {
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      await logout();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  /**
   * Store tokens securely
   */
  const storeTokens = async (accessToken: string, refreshToken: string) => {
    try {
      // Decode JWT to get expiry (basic decode, production would use jwt-decode library)
      const tokenParts = accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
          [STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString()],
        ]);
      }
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }
  };

  /**
   * Login user
   */
  const login = async (emailOrPhone: string, password: string) => {
    try {
      const response = await AuthAPI.login({ emailOrPhone, password });
      
      // Only store user and tokens if OTP is not required
      if (response.data.tokens && !response.data.requiresOTP) {
        await storeTokens(
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(response.data.user)
        );
        await updateLastActivity();
        setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Signup user
   */
  const signup = async (fullName: string, emailOrPhone: string, password: string) => {
    try {
      const response = await AuthAPI.signup({ fullName, emailOrPhone, password });
      // Tokens are provided after OTP verification
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update user after OTP verification
   */
  const updateUserWithTokens = async (userData: User, tokens: { accessToken: string; refreshToken: string }) => {
    try {
      await storeTokens(tokens.accessToken, tokens.refreshToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      await updateLastActivity();
      setUser(userData);
    } catch (error) {
      console.error('Error updating user with tokens:', error);
      throw error;
    }
  };

  /**
   * Clear all auth data
   */
  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.TOKEN_EXPIRY,
        STORAGE_KEYS.LAST_ACTIVITY,
      ]);
      setUser(null);
      clearTimers();
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API
      await AuthAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await clearAuthData();
      setIsLoading(false);
    }
  };

  /**
   * Enhanced setUser that also stores to AsyncStorage
   */
  const setUserWithStorage = async (userData: User | null) => {
    if (userData) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      await updateLastActivity();
    } else {
      await clearAuthData();
    }
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshSession,
        setUser: setUserWithStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};