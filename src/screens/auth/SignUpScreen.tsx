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
import { Mail, User, Lock } from 'lucide-react-native';

import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import SocialButton from '../../components/auth/SocialButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { validators, validateEmailOrPhone } from '../../utils/validators';

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
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

  const handleContinue = async () => {
    // Clear previous errors
    setGeneralError('');
    const newErrors: typeof errors = {};

    if (!validators.fullName(fullName)) {
      newErrors.fullName = 'Please enter your full name';
    }

    const emailOrPhoneValidation = validateEmailOrPhone(emailOrPhone);
    if (!emailOrPhoneValidation.valid) {
      newErrors.emailOrPhone = emailOrPhoneValidation.message || 'Invalid input';
    }

    const passwordValidation = validators.password(password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message || 'Invalid password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await AuthAPI.signup({ fullName, emailOrPhone, password });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API response
      const simulatedResponse = {
        success: true,
        requiresOTP: emailOrPhoneValidation.type === 'phone',
      };

      if (simulatedResponse.requiresOTP) {
        navigation.navigate('OTPVerification', {
          phoneNumber: '+254' + emailOrPhone,
          isSignup: true,
        });
      } else {
        navigation.replace('Main');
      }
    } catch (error: any) {
      // Handle different error scenarios
      if (error.status === 409) {
        setGeneralError('An account with this email/phone already exists. Please login.');
      } else {
        setGeneralError(
          error.message || 'Signup failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google Sign-In
    console.log('Google signup');
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
          message="Creating your account..."
        />
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-6 pt-16"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-10">
          <Text className="text-4xl font-bold text-white mb-3">
            Create Account
          </Text>
          <Text className="text-base text-text-secondary">
            Join the voice community today
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
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
            label="Full Name"
            icon={User}
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) setErrors({ ...errors, fullName: undefined });
              if (generalError) setGeneralError('');
            }}
            placeholder="John Doe"
            autoCapitalize="words"
            error={errors.fullName}
          />

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
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: undefined });
              if (generalError) setGeneralError('');
            }}
            placeholder="Create a strong password"
            isPassword
            error={errors.password}
          />

          {/* Signup Button */}
          <AuthButton
            title="Create Account"
            onPress={handleContinue}
            loading={loading}
            disabled={loading}
            className="mb-4 mt-2"
          />

          {/* Divider */}
          <View className="flex-row items-center my-5">
            <View className="flex-1 h-[1px] bg-[#374151]" />
            <Text className="mx-4 text-sm text-text-tertiary font-semibold">
              OR
            </Text>
            <View className="flex-1 h-[1px] bg-[#374151]" />
          </View>

          {/* Google Signup */}
          <SocialButton onPress={handleGoogleSignup} loading={false} />

          {/* Login Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="items-center py-4 mt-4"
            disabled={loading}
          >
            <Text className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Text className="text-primary font-semibold">Sign In</Text>
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