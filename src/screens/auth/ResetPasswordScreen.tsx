import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Lock, ArrowLeft } from 'lucide-react-native';

import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { validators } from '../../utils/validators';
import AuthAPI from '../../services/api/auth.api';
import { ApiError } from '../../services/api/api.client';

type ResetPasswordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
  route: RouteProp<RootStackParamList, 'ResetPassword'>;
};

export default function ResetPasswordScreen({
  navigation,
  route,
}: ResetPasswordScreenProps) {
  const { phoneNumber, resetToken } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    if (errors.newPassword) {
      setErrors({ ...errors, newPassword: undefined });
    }
    if (generalError) setGeneralError('');
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: undefined });
    }
    if (generalError) setGeneralError('');
  };

  const handleResetPassword = async () => {
    setGeneralError('');
    const newErrors: typeof errors = {};

    const passwordValidation = validators.password(newPassword);
    if (!passwordValidation.valid) {
      newErrors.newPassword = passwordValidation.message;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await AuthAPI.resetPassword({
        resetToken,
        newPassword,
      });

      if (response.success) {
        // Show success message
        Alert.alert(
          'Password Reset Successful',
          'Your password has been successfully reset. You can now sign in with your new password.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              },
            },
          ]
        );
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 400:
            setGeneralError('Invalid or expired reset token. Please request a new one.');
            break;
          case 401:
            setGeneralError('Reset token has expired. Please start the process again.');
            break;
          default:
            setGeneralError(err.message || 'Failed to reset password. Please try again.');
        }
      } else {
        setGeneralError('Failed to reset password. Please check your connection and try again.');
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

      {loading && (
        <LoadingSpinner overlay message="Resetting password..." />
      )}

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
          <Text className="text-4xl font-bold text-white mb-3">
            Reset Password
          </Text>
          <Text className="text-base text-text-secondary leading-6">
            Create a new password for your account
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
            label="New Password"
            icon={Lock}
            value={newPassword}
            onChangeText={handleNewPasswordChange}
            placeholder="Enter new password"
            isPassword
            error={errors.newPassword}
          />

          <AuthInput
            label="Confirm Password"
            icon={Lock}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            placeholder="Re-enter new password"
            isPassword
            error={errors.confirmPassword}
          />

          <View className="bg-surface rounded-xl p-4 mb-6">
            <Text className="text-text-secondary text-xs mb-2 font-semibold">
              Password must contain:
            </Text>
            <View className="space-y-1">
              <Text className={`text-xs ${newPassword.length >= 8 ? 'text-green-500' : 'text-text-tertiary'}`}>
                • At least 8 characters
              </Text>
              <Text className={`text-xs ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-text-tertiary'}`}>
                • One uppercase letter
              </Text>
              <Text className={`text-xs ${/[a-z]/.test(newPassword) ? 'text-green-500' : 'text-text-tertiary'}`}>
                • One lowercase letter
              </Text>
              <Text className={`text-xs ${/\d/.test(newPassword) ? 'text-green-500' : 'text-text-tertiary'}`}>
                • One number
              </Text>
            </View>
          </View>

          <AuthButton
            title="Reset Password"
            onPress={handleResetPassword}
            loading={loading}
            disabled={loading || !newPassword || !confirmPassword}
          />
        </View>

        <Text className="text-xs text-text-tertiary text-center leading-5 mt-auto mb-6">
          Make sure to choose a strong password that you haven't used before
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}