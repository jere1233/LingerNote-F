// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthAPI from '../services/api/auth.api';

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
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (accessToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const response = await AuthAPI.login({ emailOrPhone, password });
      
      if (response.data.tokens && !response.data.requiresOTP) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (fullName: string, emailOrPhone: string, password: string) => {
    try {
      const response = await AuthAPI.signup({ fullName, emailOrPhone, password });
      
      if (response.data.tokens && !response.data.requiresOTP) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      setUser(null);
      setIsLoading(false);
    }
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
        setUser,
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