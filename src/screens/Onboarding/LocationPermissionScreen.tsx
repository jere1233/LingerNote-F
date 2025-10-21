import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { ArrowLeft, MapPin, Check } from 'lucide-react-native';

type LocationPermissionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LocationPermission'>;
  route: RouteProp<RootStackParamList, 'LocationPermission'>;
};

export default function LocationPermissionScreen({
  navigation,
  route,
}: LocationPermissionScreenProps) {
  const { role, interests } = route.params;

  const handleAllowLocation = () => {
    // Here you would request location permission using expo-location
    // For now, just navigate to next screen
    navigation.navigate('PaymentSetup', { role, interests, locationEnabled: true });
  };

  const handleSkip = () => {
    navigation.navigate('PaymentSetup', { role, interests, locationEnabled: false });
  };

  const handleBack = () => {
    navigation.goBack();
  };

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
            <View className="w-6 h-2 bg-purple-600 rounded-full" />
            <View className="w-2 h-2 bg-gray-300 rounded-full" />
          </View>

          <View className="w-10" />
        </View>

        {/* Illustration */}
        <View className="flex-1 items-center justify-center py-12">
          <View className="w-40 h-40 bg-purple-50 rounded-full items-center justify-center mb-8">
            <MapPin size={80} color="#9333EA" strokeWidth={1.5} />
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-3 px-4">
            Enable Location
          </Text>

          <Text className="text-base text-gray-600 text-center px-8 mb-8">
            Help us find mentors near you for in-person learning sessions
          </Text>
        </View>

        {/* Benefits List */}
        <View className="bg-white rounded-2xl p-4 mb-6">
          <View className="flex-row items-start mb-3">
            <View className="w-5 h-5 bg-green-500 rounded-full items-center justify-center mr-3 mt-0.5">
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text className="text-sm text-gray-900 flex-1 leading-5">
              Discover local mentors in your area
            </Text>
          </View>

          <View className="flex-row items-start mb-3">
            <View className="w-5 h-5 bg-green-500 rounded-full items-center justify-center mr-3 mt-0.5">
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text className="text-sm text-gray-900 flex-1 leading-5">
              Get personalized recommendations
            </Text>
          </View>

          <View className="flex-row items-start">
            <View className="w-5 h-5 bg-green-500 rounded-full items-center justify-center mr-3 mt-0.5">
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text className="text-sm text-gray-900 flex-1 leading-5">
              See distance and travel time
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View className="px-6 pb-8 bg-gray-50">
        <TouchableOpacity
          onPress={handleAllowLocation}
          className="bg-purple-600 py-5 rounded-2xl mb-3 active:bg-purple-700"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-lg font-bold">
            Allow Location Access
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