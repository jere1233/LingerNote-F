import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { ArrowLeft, GraduationCap, Lightbulb, Check } from 'lucide-react-native';

type RoleSelectionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RoleSelection'>;
};

type Role = 'learner' | 'mentor' | null;

export default function RoleSelectionScreen({ navigation }: RoleSelectionScreenProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('InterestSelection', { role: selectedRole });
    }
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
            <View className="w-6 h-2 bg-purple-600 rounded-full" />
            <View className="w-2 h-2 bg-gray-300 rounded-full" />
            <View className="w-2 h-2 bg-gray-300 rounded-full" />
            <View className="w-2 h-2 bg-gray-300 rounded-full" />
          </View>

          <View className="w-10" />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Path
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          Select how you'd like to use MentorMatch
        </Text>

        {/* Learner Card */}
        <TouchableOpacity
          onPress={() => setSelectedRole('learner')}
          className={`bg-white rounded-3xl p-6 mb-4 border-2 ${
            selectedRole === 'learner'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200'
          }`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-start justify-between mb-4">
            <View
              className={`w-16 h-16 rounded-2xl items-center justify-center ${
                selectedRole === 'learner' ? 'bg-purple-600' : 'bg-purple-50'
              }`}
            >
              <GraduationCap
                size={32}
                color={selectedRole === 'learner' ? '#FFFFFF' : '#9333EA'}
                strokeWidth={2}
              />
            </View>

            {selectedRole === 'learner' && (
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </View>

          <Text
            className={`text-xl font-bold mb-1 ${
              selectedRole === 'learner' ? 'text-purple-600' : 'text-gray-900'
            }`}
          >
            I Want to Learn
          </Text>
          <Text className="text-sm text-gray-600">
            Find mentors and grow your skills
          </Text>
        </TouchableOpacity>

        {/* Mentor Card */}
        <TouchableOpacity
          onPress={() => setSelectedRole('mentor')}
          className={`bg-white rounded-3xl p-6 mb-4 border-2 ${
            selectedRole === 'mentor'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200'
          }`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-start justify-between mb-4">
            <View
              className={`w-16 h-16 rounded-2xl items-center justify-center ${
                selectedRole === 'mentor' ? 'bg-purple-600' : 'bg-purple-50'
              }`}
            >
              <Lightbulb
                size={32}
                color={selectedRole === 'mentor' ? '#FFFFFF' : '#9333EA'}
                strokeWidth={2}
              />
            </View>

            {selectedRole === 'mentor' && (
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </View>

          <Text
            className={`text-xl font-bold mb-1 ${
              selectedRole === 'mentor' ? 'text-purple-600' : 'text-gray-900'
            }`}
          >
            I Want to Teach
          </Text>
          <Text className="text-sm text-gray-600">
            Share your expertise and earn income
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-8 bg-gray-50">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedRole}
          className={`py-5 rounded-2xl ${
            selectedRole ? 'bg-purple-600 active:bg-purple-700' : 'bg-gray-300'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-lg font-bold">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}