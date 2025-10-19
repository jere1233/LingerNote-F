import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Mail, Lock } from 'lucide-react-native';

import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import SocialButton from '../../components/auth/SocialButton';
import ErrorMessage from '../../components/common/ErrorMessage';
import { validateEmailOrPhone } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/api/api.client';
import AuthAPI from '../../services/api/auth.api';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

// Link web browser to events
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, updateUserWithTokens } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    emailOrPhone?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Google OAuth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirectUri: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URL || '',
  });

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSuccess(id_token);
    } else if (response?.type === 'error') {
      setGoogleLoading(false);
      setGeneralError('Google login was cancelled or failed');
    }
  }, [response]);

  const handleGoogleSuccess = async (idToken: string) => {
    try {
      setGoogleLoading(true);
      setGeneralError('');

      // Send token to backend
      const response = await AuthAPI.googleAuth({ idToken });

      if (response.data.user && response.data.tokens) {
        // Update auth context with user and tokens
        await updateUserWithTokens(response.data.user, response.data.tokens);
        
        // Navigate to main app
        navigation.replace('Main');
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            setGeneralError('Google authentication failed. Please try again.');
            break;
          case 400:
            setGeneralError(error.message || 'Invalid Google token');
            break;
          default:
            setGeneralError(error.message || 'Google login failed');
        }
      } else {
        setGeneralError('Google login failed. Please check your connection.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailOrPhoneChange = (text: string) => {
    setEmailOrPhone(text);
    if (errors.emailOrPhone) {
      setErrors({ ...errors, emailOrPhone: undefined });
    }
    if (generalError) setGeneralError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
    if (generalError) setGeneralError('');
  };

  const handleLogin = async () => {
    setGeneralError('');
    const newErrors: typeof errors = {};

    const emailOrPhoneValidation = validateEmailOrPhone(emailOrPhone);
    if (!emailOrPhoneValidation.valid) {
      newErrors.emailOrPhone = emailOrPhoneValidation.message || 'Invalid input';
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await login(emailOrPhone, password);

      if (response.data.requiresVerification) {
        const phoneNumber = emailOrPhoneValidation.type === 'phone'
          ? `+254${emailOrPhone}`
          : emailOrPhone;

        navigation.navigate('OTPVerification', {
          phoneNumber,
          isSignup: false,
        });
      } else {
        navigation.replace('Main');
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            setGeneralError('Invalid email/phone or password');
            break;
          case 404:
            setGeneralError('No account found with these credentials');
            break;
          case 403:
            setGeneralError('Account is suspended. Please contact support');
            break;
          default:
            setGeneralError(error.message || 'Login failed. Please try again.');
        }
      } else {
        setGeneralError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGeneralError('');
      const result = await promptAsync();
      if (result?.type !== 'success') {
        setGeneralError('Google login was cancelled');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setGeneralError('Failed to start Google login');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-6 pt-20"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-12">
          <Text className="text-4xl font-bold text-gray-900 mb-3">
            Welcome Back
          </Text>
          <Text className="text-base text-gray-600">
            Sign in to continue to Vyn
          </Text>
        </View>

        <View className="mb-8">
          {generalError && (
            <ErrorMessage
              message={generalError}
              type="error"
              onDismiss={() => setGeneralError('')}
              dismissible
              className="mb-4"
            />
          )}

          <AuthInput
            label="Email or Phone Number"
            icon={Mail}
            value={emailOrPhone}
            onChangeText={handleEmailOrPhoneChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.emailOrPhone}
          />

          <AuthInput
            label="Password"
            icon={Lock}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Enter your password"
            isPassword
            error={errors.password}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            className="self-end -mt-2 mb-4"
          >
            <Text className="text-sm text-purple-500 font-semibold">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <AuthButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading || googleLoading}
            className="mb-4"
            LoadingComponent={<ActivityIndicator size="small" color="#ffffff" />}
          />

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-sm text-gray-500 font-semibold">
              OR
            </Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <SocialButton
            onPress={handleGoogleLogin}
            loading={googleLoading}
            disabled={!request || loading}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            className="items-center py-4 mt-4"
            disabled={loading || googleLoading}
          >
            <Text className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Text className="text-purple-500 font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}