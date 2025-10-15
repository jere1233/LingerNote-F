// src/screens/auth/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Image, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Splash">;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Centered Content */}
      <View className="flex-1 items-center justify-center">
        <Animated.View
          className="items-center gap-4"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* Logo Container */}
          <View className="w-32 h-32 rounded-3xl bg-purple-500/10 items-center justify-center mb-2">
            <Image
              source={require("../../../assets/logo.png")}
              className="w-28 h-28 rounded-2xl"
              resizeMode="cover"
            />
          </View>

          {/* App Name */}
          <Text className="text-5xl font-bold text-white tracking-tight">
            Vyn
          </Text>

          {/* Tagline */}
          <Text className="text-base text-gray-400 font-medium tracking-wide">
            Voice. Community. Connection.
          </Text>
        </Animated.View>
      </View>

      {/* Progress Bar */}
      <View className="absolute bottom-20 w-full px-10">
        <View className="w-full h-1 bg-purple-500/20 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-purple-500 rounded-full"
            style={{ width: progressWidth }}
          />
        </View>
      </View>
    </View>
  );
}