import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Mail, Lock } from 'lucide-react-native';

import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import SocialButton from '../../components/auth/SocialButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { validateEmailOrPhone } from '../../utils/validators';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
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
    // Clear previous errors
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
      // TODO: Replace with actual API call
      // const response = await AuthAPI.login({ emailOrPhone, password });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API response
      const simulatedResponse = {
        success: true,
        requiresOTP: emailOrPhoneValidation.type === 'phone',
      };

      if (simulatedResponse.requiresOTP) {
        navigation.navigate('OTPVerification', {
          phoneNumber: '+254' + emailOrPhone,
          isSignup: false,
        });
      } else {
        navigation.replace('Main');
      }
    } catch (error: any) {
      // Handle different error scenarios
      setGeneralError(
        error.message || 'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google Sign-In
    console.log('Google login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Loading Overlay */}
      {loading && (
        <LoadingSpinner
          overlay
          message="Signing you in..."
        />
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-6 pt-20"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-12">
          <Text className="text-4xl font-bold text-white mb-3">
            Welcome Back
          </Text>
          <Text className="text-base text-text-secondary">
            Sign in to continue to LingerNote
          </Text>
        </View>

        {/* Form */}
        <View className="mb-8">
          {/* General Error Message */}
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
            placeholder="email@example.com or 712345678"
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

          {/* Forgot Password */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('ForgotPassword')}
            className="self-end -mt-2 mb-4"
          >
            <Text className="text-sm text-[#a855f7] font-semibold">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <AuthButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            className="mb-4"
          />

          {/* Divider */}
          <View className="flex-row items-center my-5">
            <View className="flex-1 h-[1px] bg-[#374151]" />
            <Text className="mx-4 text-sm text-text-tertiary font-semibold">
              OR
            </Text>
            <View className="flex-1 h-[1px] bg-[#374151]" />
          </View>

          {/* Google Login */}
          <SocialButton onPress={handleGoogleLogin} loading={false} />

          {/* Sign Up Link */}
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

        {/* Terms */}
        <Text className="text-xs text-text-tertiary text-center leading-5 mt-auto mb-6">
          By continuing, you agree to our{' '}
          <Text className="text-primary font-semibold">Terms of Service</Text> and{' '}
          <Text className="text-primary font-semibold">Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}