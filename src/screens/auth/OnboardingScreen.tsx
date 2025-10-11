// src/screens/auth/OnboardingScreen.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { Mic, Users, TrendingUp } from "lucide-react-native";

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Onboarding">;
};

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    icon: Mic,
    title: "Share Your Voice",
    description: "Record and share 60-second voice notes with communities you love",
    iconColor: "#A855F7", // purple-500
  },
  {
    id: "2",
    icon: Users,
    title: "Join Communities",
    description: "Connect with people who share your interests, from tech to sports",
    iconColor: "#3B82F6", // blue-500
  },
  {
    id: "3",
    icon: TrendingUp,
    title: "Get Heard",
    description: "Your voice matters. Start conversations, share opinions, go viral",
    iconColor: "#F97316", // orange-500
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
      navigation.replace("Login");
    }
  };

  const handleSkip = () => {
    navigation.replace("Login");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderSlide = ({ item }: { item: typeof slides[0] }) => {
    const IconComponent = item.icon;
    
    return (
      <View style={{ width }} className="flex-1 items-center justify-center px-8">
        {/* Icon Container */}
        <View className="w-36 h-36 bg-gray-800 rounded-full items-center justify-center mb-10 shadow-2xl">
          <IconComponent size={80} color={item.iconColor} strokeWidth={1.5} />
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-white text-center mb-4 px-4">
          {item.title}
        </Text>

        {/* Description */}
        <Text className="text-lg text-gray-400 text-center leading-7 px-6">
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity
          onPress={handleSkip}
          className="absolute top-14 right-6 z-10 px-4 py-2"
        >
          <Text className="text-gray-400 text-base font-semibold">Skip</Text>
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
      />

      {/* Bottom Section */}
      <View className="absolute bottom-0 left-0 right-0 px-8 pb-12">
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex
                  ? "w-8 bg-purple-500"
                  : "w-2 bg-gray-700"
              }`}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-purple-500 py-5 rounded-full items-center active:bg-purple-600 shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold">
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}