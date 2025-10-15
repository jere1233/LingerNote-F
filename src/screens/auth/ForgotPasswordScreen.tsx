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
import ErrorMessage from '../../components/common/ErrorMessage';
import { validateEmailOrPhone } from '../../utils/validators';
import AuthAPI from '../../services/api/auth.api';
import { ApiError } from '../../services/api/api.client';

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
      const response = await AuthAPI.forgotPassword({ emailOrPhone });

      if (response.success) {
        // Navigate to OTP verification
        const phoneNumber = emailOrPhoneValidation.type === 'phone'
          ? `+254${emailOrPhone}`
          : emailOrPhone;

        navigation.navigate('OTPVerification', {
          phoneNumber,
          isSignup: false,
          isForgotPassword: true,
        });
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 404:
            setError('No account found with this email/phone number');
            break;
          case 429:
            setError('Too many requests. Please try again later');
            break;
          default:
            setError(err.message || 'Failed to send code. Please try again.');
        }
      } else {
        setError('Failed to send code. Please check your connection and try again.');
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


      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-surface items-center justify-center mt-16 mb-8"
          disabled={loading}
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>

        <View className="mb-12">
          <Text className="text-3xl font-bold text-white mb-3">
            Forgot Password?
          </Text>
          <Text className="text-base text-text-secondary leading-6">
            Enter your email or phone number and we'll send you a code to reset your password.
          </Text>
        </View>

        <View className="mb-8">
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
            keyboardType="email-address"
            autoCapitalize="none"
            error=""
          />

          <AuthButton
            title="Send Code"
            onPress={handleContinue}
            loading={loading}
            disabled={loading || !emailOrPhone}
            className="mt-4"
          />

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

        <Text className="text-xs text-text-tertiary text-center leading-5 mt-auto mb-6">
          Need more help?{' '}
          <Text className="text-primary font-semibold">Contact Support</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}