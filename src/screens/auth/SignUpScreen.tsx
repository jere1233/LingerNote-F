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
import { User, Mail, Lock } from 'lucide-react-native';

import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import SocialButton from '../../components/auth/SocialButton';
import ErrorMessage from '../../components/common/ErrorMessage';
import { validators, validateEmailOrPhone } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/api/api.client';

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const { signup } = useAuth();
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

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (errors.fullName) {
      setErrors({ ...errors, fullName: undefined });
    }
    if (generalError) setGeneralError('');
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

  const handleSignup = async () => {
    setGeneralError('');
    const newErrors: typeof errors = {};

    const nameValidation = validators.fullName(fullName);
    if (!nameValidation.valid) {
      newErrors.fullName = nameValidation.message;
    }

    const emailOrPhoneValidation = validateEmailOrPhone(emailOrPhone);
    if (!emailOrPhoneValidation.valid) {
      newErrors.emailOrPhone = emailOrPhoneValidation.message || 'Invalid input';
    }

    const passwordValidation = validators.password(password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await signup(fullName, emailOrPhone, password);

      // FIXED: Changed from requiresOTP to requiresVerification
      if (response.data.requiresVerification) {
        const phoneNumber = emailOrPhoneValidation.type === 'phone'
          ? `+254${emailOrPhone}`
          : emailOrPhone;

        navigation.navigate('OTPVerification', {
          phoneNumber,
          isSignup: true,
        });
      } else {
        navigation.replace('Main');
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 409:
            setGeneralError('An account with this email/phone already exists');
            break;
          case 400:
            setGeneralError(error.message || 'Invalid signup data. Please check your information');
            break;
          default:
            setGeneralError(error.message || 'Signup failed. Please try again.');
        }
      } else {
        setGeneralError('Signup failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    console.log('Google signup - To be implemented');
    setGeneralError('Google signup coming soon!');
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
            Create Account
          </Text>
          <Text className="text-base text-text-secondary">
            Join Vyn today
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
            label="Full Name"
            icon={User}
            value={fullName}
            onChangeText={handleFullNameChange}
            autoCapitalize="words"
            error={errors.fullName}
          />

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
            isPassword
            error={errors.password}
          />

          <AuthButton
            title="Create Account"
            onPress={handleSignup}
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

          <SocialButton onPress={handleGoogleSignup} loading={false} />

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

        <Text className="text-xs text-text-tertiary text-center leading-5 mt-auto mb-6">
          By continuing, you agree to our{' '}
          <Text className="text-primary font-semibold">Terms of Service</Text> and{' '}
          <Text className="text-primary font-semibold">Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}