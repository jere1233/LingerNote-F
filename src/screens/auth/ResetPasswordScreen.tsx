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
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Lock, ArrowLeft } from 'lucide-react-native';

import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { validators } from '../../utils/validators';

type ResetPasswordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
  route: RouteProp<RootStackParamList, 'ResetPassword'>;
};

export default function ResetPasswordScreen({
  navigation,
  route,
}: ResetPasswordScreenProps) {
  const { phoneNumber } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    if (errors.newPassword) {
      setErrors({ ...errors, newPassword: undefined });
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: undefined });
    }
  };

  const handleResetPassword = async () => {
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
    // TODO: API call to reset password
    setTimeout(() => {
      setLoading(false);
      // Show success message and navigate to login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 1500);
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
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-surface items-center justify-center mt-16 mb-8"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-12">
          <Text className="text-4xl font-bold text-white mb-3">
            Reset Password
          </Text>
          <Text className="text-base text-text-secondary leading-6">
            Create a new password for your account
          </Text>
        </View>

        {/* Form */}
        <View className="mb-8">
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

          {/* Password Requirements */}
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

          {/* Reset Button */}
          <AuthButton
            title="Reset Password"
            onPress={handleResetPassword}
            loading={loading}
          />
        </View>

        {/* Help Text */}
        <Text className="text-xs text-text-tertiary text-center leading-5 mt-auto mb-6">
          Your password has been successfully reset. You can now sign in with your new password.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}