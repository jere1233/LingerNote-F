import React, { useState } from 'react';
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
import { ArrowLeft } from 'lucide-react-native';

type InterestSelectionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'InterestSelection'>;
  route: RouteProp<RootStackParamList, 'InterestSelection'>;
};

type Interest = {
  id: string;
  icon: string;
  label: string;
};

const interests: Interest[] = [
  { id: '1', icon: '💻', label: 'Web Dev' },
  { id: '2', icon: '📱', label: 'Mobile' },
  { id: '3', icon: '🎨', label: 'Design' },
  { id: '4', icon: '💼', label: 'Business' },
  { id: '5', icon: '📢', label: 'Marketing' },
  { id: '6', icon: '🌍', label: 'Languages' },
  { id: '7', icon: '🎵', label: 'Music' },
  { id: '8', icon: '📸', label: 'Photo' },
  { id: '9', icon: '✍️', label: 'Writing' },
  { id: '10', icon: '🍳', label: 'Cooking' },
  { id: '11', icon: '💪', label: 'Fitness' },
  { id: '12', icon: '🖌️', label: 'Art' },
  { id: '13', icon: '💰', label: 'Finance' },
  { id: '14', icon: '🤖', label: 'AI & ML' },
  { id: '15', icon: '☁️', label: 'Cloud' },
  { id: '16', icon: '📊', label: 'Data Science' },
  { id: '17', icon: '🎬', label: 'Video Edit' },
  { id: '18', icon: '🎮', label: 'Gaming' },
];

export default function InterestSelectionScreen({
  navigation,
  route,
}: InterestSelectionScreenProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { role } = route.params;

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length >= 3) {
      navigation.navigate('LocationPermission', { role, interests: selectedInterests });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedInterests.length >= 3;

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
            <View className="w-6 h-2 bg-purple-600 rounded-full" />
            <View className="w-2 h-2 bg-gray-300 rounded-full" />
            <View className="w-2 h-2 bg-gray-300 rounded-full" />
          </View>

          <View className="w-10" />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          What Interests You?
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          Select at least 3 topics you want to learn
        </Text>

        {/* Interests Grid */}
        <View className="flex-row flex-wrap justify-center mb-6" style={{ gap: 12 }}>
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <TouchableOpacity
                key={interest.id}
                onPress={() => toggleInterest(interest.id)}
                className={`bg-white rounded-xl p-3 border-2 items-center ${
                  isSelected
                    ? 'border-purple-600 bg-purple-600'
                    : 'border-gray-200'
                }`}
                style={{ width: '29%' }}
                activeOpacity={0.7}
              >
                <Text className="text-3xl mb-1">{interest.icon}</Text>
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {interest.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selection Counter */}
        <Text className="text-sm text-gray-600 text-center mb-4">
          {selectedInterests.length} selected {isValid ? '✓' : `(${3 - selectedInterests.length} more needed)`}
        </Text>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-8 bg-gray-50">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isValid}
          className={`py-5 rounded-2xl ${
            isValid ? 'bg-purple-600 active:bg-purple-700' : 'bg-gray-300'
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