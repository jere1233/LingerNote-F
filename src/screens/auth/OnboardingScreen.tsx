import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Mic, Users, TrendingUp } from 'lucide-react-native';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: Mic,
    title: 'Share Your Learning Goals',
    description: 'Record a short video to describe what you want to learn. Connect instantly with verified mentors tailored to your needs',
    iconColor: '#2563EB', // blue-600
  },
  {
    id: '2',
    icon: Users,
    title: 'Find Local & Global Mentors',
    description: 'Discover qualified mentors near you or worldwide. Choose online or in-person learning sessions',
    iconColor: '#A855F7', // purple-600
  },
  {
    id: '3',
    icon: TrendingUp,
    title: 'Learn & Grow',
    description: 'Get personalized mentorship with AI-powered matching. Start your skill journey today',
    iconColor: '#10B981', // emerald-600
  },
];

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Login');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderSlide = ({ item }: { item: typeof slides[0] }) => {
    const IconComponent = item.icon;

    return (
      <View style={{ width }} className="flex-1 items-center justify-center px-8 bg-white">
        {/* Icon Container */}
        <View className="w-32 h-32 bg-blue-50 rounded-3xl items-center justify-center mb-12">
          <IconComponent size={80} color={item.iconColor} strokeWidth={1.5} />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
          {item.title}
        </Text>

        {/* Description */}
        <Text className="text-base text-gray-600 text-center leading-6 px-4">
          {item.description}
        </Text>
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity
          onPress={handleSkip}
          className="absolute top-12 right-6 z-10 px-4 py-2"
        >
          <Text className="text-gray-500 text-base font-semibold">Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        scrollEventThrottle={16}
      />

      {/* Bottom Section */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-10 bg-white">
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1.5 transition-all ${
                index === currentIndex ? 'w-8 bg-purple-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentIndex === 0}
            className={`flex-1 py-4 px-4 rounded-lg items-center justify-center ${
              currentIndex === 0 ? 'bg-gray-100' : 'bg-gray-100'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-base font-semibold ${
                currentIndex === 0 ? 'text-gray-400' : 'text-gray-900'
              }`}
            >
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 py-4 px-4 bg-purple-500 rounded-lg items-center justify-center active:bg-purple-600"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-bold">
              {isLastSlide ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}