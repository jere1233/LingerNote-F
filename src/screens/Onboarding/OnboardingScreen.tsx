import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Lightbulb, BookOpen, Video, CreditCard } from 'lucide-react-native';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: Lightbulb,
    title: 'MentorMatch',
    subtitle: 'Learn Anything From Anyone, Anywhere',
    features: [
      { icon: '🔍', text: 'Find perfect mentors instantly' },
      { icon: '📹', text: 'Learn live or at your pace' },
      { icon: '💳', text: 'Pay securely with M-Pesa' },
    ],
  },
];

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleGetStarted = () => {
    navigation.navigate('RoleSelection');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => {
    const IconComponent = item.icon;

    return (
      <View style={{ width }} className="flex-1 bg-gradient-to-b from-purple-600 to-purple-700 px-6 pt-20 pb-8">
        {/* Hero Section */}
        <View className="flex-1 items-center justify-center">
          <View className="w-32 h-32 bg-white/20 rounded-full items-center justify-center mb-6">
            <IconComponent size={64} color="#FFFFFF" strokeWidth={1.5} />
          </View>
          
          <Text className="text-4xl font-bold text-white text-center mb-3">
            {item.title}
          </Text>
          
          <Text className="text-lg text-white/90 text-center px-4">
            {item.subtitle}
          </Text>
        </View>

        {/* Features List */}
        <View className="mb-8">
          {item.features.map((feature, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center"
            >
              <View className="w-12 h-12 bg-purple-50 rounded-xl items-center justify-center mr-4">
                <Text className="text-2xl">{feature.icon}</Text>
              </View>
              <Text className="text-base font-semibold text-gray-900 flex-1">
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={handleGetStarted}
          className="bg-white py-5 rounded-2xl mb-3 active:bg-gray-50"
          activeOpacity={0.8}
        >
          <Text className="text-purple-600 text-center text-lg font-bold">
            Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignIn}
          className="py-5 rounded-2xl"
          activeOpacity={0.7}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
}