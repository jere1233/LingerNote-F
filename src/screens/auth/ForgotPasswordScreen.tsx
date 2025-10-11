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
import { Mail, ArrowLeft } from 'lucide-react-native';

import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { validateEmailOrPhone } from '../../utils/validators';

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailOrPhoneChange = (text: string) => {
    setEmailOrPhone(text);
    if (error) {
      setError('');
    }
  };

  const handleContinue = async () => {
    setError('');
    
    const emailOrPhoneValidation = validateEmailOrPhone(emailOrPhone);
    
    if (!emailOrPhoneValidation.valid) {
      setError(emailOrPhoneValidation.message || 'Invalid email or phone number');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await AuthAPI.forgotPassword({ emailOrPhone });

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to OTP verification
      if (emailOrPhoneValidation.type === 'phone') {
        navigation.navigate('OTPVerification', {
          phoneNumber: '+254' + emailOrPhone,
          isSignup: false,
          isForgotPassword: true,
        });
      } else {
        navigation.navigate('OTPVerification', {
          phoneNumber: emailOrPhone,
          isSignup: false,
          isForgotPassword: true,
        });
      }
    } catch (err: any) {
      if (err.status === 404) {
        setError('No account found with this email/phone number');
      } else {
        setError(err.message || 'Failed to send code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
          message="Sending verification code..."
        />
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-surface items-center justify-center mt-16 mb-8"
          disabled={loading}
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-12">
          <Text className="text-4xl font-bold text-white mb-3">
            Forgot Password?
          </Text>
          <Text className="text-base text-text-secondary leading-6">
            Don't worry! Enter your email or phone number and we'll send you a code to reset your password.
          </Text>
        </View>

        {/* Form */}
        <View className="mb-8">
          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error}
              type="error"
              onDismiss={() => setError('')}
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
            error=""
          />

          {/* Continue Button */}
          <AuthButton
            title="Send Code"
            onPress={handleContinue}
            loading={loading}
            disabled={loading || !emailOrPhone}
            className="mt-4"
          />

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="items-center py-4 mt-6"
            disabled={loading}
          >
            <Text className="text-sm text-text-secondary">
              Remember your password?{' '}
              <Text className="text-primary font-semibold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <Text className="text-xs text-text-tertiary text-center leading-5 mt-auto mb-6">
          Need more help?{' '}
          <Text className="text-primary font-semibold">Contact Support</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}