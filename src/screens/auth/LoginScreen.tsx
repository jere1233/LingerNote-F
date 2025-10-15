import React, { useState } from 'react';
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
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Mail, Lock } from 'lucide-react-native';

import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import SocialButton from '../../components/auth/SocialButton';
import ErrorMessage from '../../components/common/ErrorMessage';
import { validateEmailOrPhone } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/api/api.client';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    emailOrPhone?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

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
      
      if (response.data.requiresOTP) {
        // Navigate to OTP verification
        const phoneNumber = emailOrPhoneValidation.type === 'phone' 
          ? `+254${emailOrPhone}`
          : emailOrPhone;
        
        navigation.navigate('OTPVerification', {
          phoneNumber,
          isSignup: false,
        });
      } else {
        // Login successful, navigate to main app
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
    // TODO: Implement Google Sign-In with proper OAuth flow
    console.log('Google login - To be implemented');
    setGeneralError('Google login coming soon!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-6 pt-20"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-12">
          <Text className="text-4xl font-bold text-white mb-3">
            Welcome Back
          </Text>
          <Text className="text-base text-text-secondary">
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
            <Text className="text-sm text-[#a855f7] font-semibold">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <AuthButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            className="mb-4"
            LoadingComponent={<ActivityIndicator size="small" color="#ffffff" />}
          />

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-[1px] bg-[#374151]" />
            <Text className="mx-4 text-sm text-text-tertiary font-semibold">
              OR
            </Text>
            <View className="flex-1 h-[1px] bg-[#374151]" />
          </View>

          <SocialButton onPress={handleGoogleLogin} loading={false} />

          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            className="items-center py-4 mt-4"
            disabled={loading}
          >
            <Text className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Text className="text-primary font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-text-tertiary text-center leading-5 mt-auto mb-6">
          By continuing, you agree to our{' '}
          <Text className="text-primary font-semibold">Terms of Service</Text> and{' '}
          <Text className="text-primary font-semibold">Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}