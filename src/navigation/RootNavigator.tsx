import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignUpScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import MainNavigator from './MainNavigator';

export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  Signup: undefined;
  OTPVerification: {
    phoneNumber: string;
    isSignup?: boolean;
    isForgotPassword?: boolean;
  };
  ForgotPassword: undefined;
  ResetPassword: {
    phoneNumber: string;
    resetToken: string;
  };
  // Main app
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export default function RootNavigator() {
  const { isLoading, isAuthenticated, isVerified } = useAuth();

  // Show loading splash while checking for existing session
  if (isLoading) {
    return (
      <View className="flex-1 bg-[#111827] items-center justify-center">
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#111827' },
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {!isAuthenticated ? (
          // ========== AUTH STACK ==========
          // User not logged in at all
          // Shows: Login, Signup, OTP, Forgot Password, Reset Password
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            
            {/* OTP Verification for signup/login/forgot password flows */}
            <Stack.Screen
              name="OTPVerification"
              component={OTPVerificationScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            
            {/* Password Reset Flow */}
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </Stack.Group>
        ) : !isVerified ? (
          // ========== VERIFICATION REQUIRED STACK ==========
          // User logged in but not verified
          // Forces OTP verification - no back button, can't skip
          <Stack.Group
            screenOptions={{
              gestureEnabled: false,
              animation: 'none',
            }}
          >
            <Stack.Screen
              name="OTPVerification"
              component={OTPVerificationScreen}
              options={{
                gestureEnabled: false,
              }}
            />
          </Stack.Group>
        ) : (
          // ========== MAIN APP STACK ==========
          // User authenticated AND verified - full app access
          // This is persistent login - they won't see auth screens
          <Stack.Group
            screenOptions={{
              gestureEnabled: false,
              animation: 'none',
            }}
          >
            <Stack.Screen
              name="Main"
              component={MainNavigator}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}