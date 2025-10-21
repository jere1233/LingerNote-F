import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { ArrowLeft, CreditCard, Smartphone, Check } from 'lucide-react-native';
import { saveOnboardingData } from '../../utils/onboardingStorage';

type PaymentSetupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PaymentSetup'>;
  route: RouteProp<RootStackParamList, 'PaymentSetup'>;
};

type PaymentMethod = 'mpesa' | 'card' | null;

export default function PaymentSetupScreen({
  navigation,
  route,
}: PaymentSetupScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { role, interests, locationEnabled } = route.params;

  const handleComplete = async () => {
    try {
      // Save all onboarding data
      await saveOnboardingData({
        role,
        interests,
        locationEnabled,
        paymentMethod: selectedMethod || undefined,
        phoneNumber: selectedMethod === 'mpesa' ? phoneNumber : undefined,
        completedAt: new Date().toISOString(),
      });

      // Navigate to signup for new users
      navigation.navigate('Signup');
    } catch (error) {
      Alert.alert('Error', 'Failed to save onboarding data. Please try again.');
      console.error('Onboarding save error:', error);
    }
  };

  const handleSkip = async () => {
    try {
      // Save onboarding data without payment method
      await saveOnboardingData({
        role,
        interests,
        locationEnabled,
        completedAt: new Date().toISOString(),
      });

      // Navigate to signup for new users
      navigation.navigate('Signup');
    } catch (error) {
      Alert.alert('Error', 'Failed to save onboarding data. Please try again.');
      console.error('Onboarding save error:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedMethod === 'mpesa' ? phoneNumber.length >= 10 : selectedMethod !== null;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between pt-5 pb-10">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 items-center justify-center"
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>

          {/* Progress Dots */}
          <View className="flex-row gap-2">
            <View className="w-2 h-2 bg-purple-600 rounded-full" />
            <View className="w-2 h-2 bg-purple-600 rounded-full" />
            <View className="w-2 h-2 bg-purple-600 rounded-full" />
            <View className="w-6 h-2 bg-purple-600 rounded-full" />
          </View>

          <View className="w-10" />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Payment Method
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          Choose how you'd like to make payments
        </Text>

        {/* M-Pesa Card */}
        <TouchableOpacity
          onPress={() => setSelectedMethod('mpesa')}
          className={`bg-white rounded-3xl p-6 mb-4 border-2 ${
            selectedMethod === 'mpesa'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200'
          }`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-start justify-between mb-4">
            <View
              className={`w-16 h-16 rounded-2xl items-center justify-center ${
                selectedMethod === 'mpesa' ? 'bg-purple-600' : 'bg-green-50'
              }`}
            >
              <Smartphone
                size={32}
                color={selectedMethod === 'mpesa' ? '#FFFFFF' : '#10B981'}
                strokeWidth={2}
              />
            </View>

            {selectedMethod === 'mpesa' && (
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </View>

          <Text
            className={`text-xl font-bold mb-1 ${
              selectedMethod === 'mpesa' ? 'text-purple-600' : 'text-gray-900'
            }`}
          >
            M-Pesa
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            Fast and secure mobile payments
          </Text>

          {selectedMethod === 'mpesa' && (
            <View className="mt-2">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="0700000000"
                keyboardType="phone-pad"
                className="bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}
        </TouchableOpacity>

        {/* Credit/Debit Card */}
        <TouchableOpacity
          onPress={() => setSelectedMethod('card')}
          className={`bg-white rounded-3xl p-6 mb-4 border-2 ${
            selectedMethod === 'card'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200'
          }`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-start justify-between mb-4">
            <View
              className={`w-16 h-16 rounded-2xl items-center justify-center ${
                selectedMethod === 'card' ? 'bg-purple-600' : 'bg-blue-50'
              }`}
            >
              <CreditCard
                size={32}
                color={selectedMethod === 'card' ? '#FFFFFF' : '#3B82F6'}
                strokeWidth={2}
              />
            </View>

            {selectedMethod === 'card' && (
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </View>

          <Text
            className={`text-xl font-bold mb-1 ${
              selectedMethod === 'card' ? 'text-purple-600' : 'text-gray-900'
            }`}
          >
            Credit/Debit Card
          </Text>
          <Text className="text-sm text-gray-600">
            Visa, Mastercard, and more
          </Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View className="bg-blue-50 rounded-2xl p-4 mb-6">
          <Text className="text-sm text-blue-900 leading-5">
            💡 You can add or change your payment method anytime in settings
          </Text>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View className="px-6 pb-8 bg-gray-50">
        <TouchableOpacity
          onPress={handleComplete}
          disabled={!isValid}
          className={`py-5 rounded-2xl mb-3 ${
            isValid ? 'bg-purple-600 active:bg-purple-700' : 'bg-gray-300'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-lg font-bold">
            Complete Setup
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkip}
          className="py-5 rounded-2xl"
          activeOpacity={0.7}
        >
          <Text className="text-purple-600 text-center text-lg font-semibold">
            Skip for Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}