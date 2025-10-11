import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { ArrowLeft } from 'lucide-react-native';
import AuthButton from '../../components/auth/AuthButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

type OTPVerificationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;
  route: RouteProp<RootStackParamList, 'OTPVerification'>;
};

export default function OTPVerificationScreen({
  navigation,
  route,
}: OTPVerificationScreenProps) {
  const { phoneNumber, isSignup, isForgotPassword } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all digits are entered
    if (newOtp.every((digit) => digit !== '') && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');

    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // if (isForgotPassword) {
      //   const response = await AuthAPI.verifyResetOTP({ emailOrPhone: phoneNumber, otp: code });
      // } else {
      //   const response = await AuthAPI.verifyOTP({ emailOrPhone: phoneNumber, otp: code, isSignup });
      // }

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate verification
      if (code === '123456') {
        if (isForgotPassword) {
          navigation.navigate('ResetPassword', { phoneNumber });
        } else {
          navigation.replace('Main');
        }
      } else {
        setError('Invalid code. Please check and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // await AuthAPI.resendOTP({ emailOrPhone: phoneNumber });

      await new Promise(resolve => setTimeout(resolve, 1000));

      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const getHeaderText = () => {
    if (isForgotPassword) {
      return {
        title: 'Verify Code',
        subtitle: `We've sent a 6-digit code to\n`,
      };
    }
    return {
      title: 'Verify Phone',
      subtitle: `We've sent a 6-digit code to\n`,
    };
  };

  const headerText = getHeaderText();

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
          message="Verifying code..."
        />
      )}

      <View className="flex-1 px-6">
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
            {headerText.title}
          </Text>
          <Text className="text-base text-text-secondary leading-6">
            {headerText.subtitle}
            <Text className="text-white font-semibold">{phoneNumber}</Text>
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            type="error"
            onDismiss={() => setError('')}
            dismissible
            className="mb-6"
          />
        )}

        {/* OTP Input */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                className={`w-[52px] h-16 bg-surface rounded-2xl border-2 ${
                  error
                    ? 'border-red-500'
                    : digit
                    ? 'border-primary'
                    : 'border-[#374151]'
                } text-white text-2xl font-bold text-center`}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
                editable={!loading}
              />
            ))}
          </View>
        </View>

        {/* Resend Code */}
        <View className="items-center mb-8">
          {timer > 0 ? (
            <Text className="text-text-secondary text-sm">
              Resend code in{' '}
              <Text className="text-primary font-semibold">{timer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <Text className="text-primary text-sm font-semibold">
                {resending ? 'Sending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <AuthButton
          title={isForgotPassword ? 'Verify Code' : 'Verify & Continue'}
          onPress={() => handleVerify()}
          loading={loading}
          disabled={loading || otp.join('').length !== 6}
        />

        {/* Help Text */}
        <Text className="text-xs text-text-tertiary text-center mt-6 leading-5">
          Didn't receive the code?{' '}
          <Text className="text-primary font-semibold">Check your SMS</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}