// src/screens/auth/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Image, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useAuth } from "../../context/AuthContext";

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Get auth state - checks for existing session
  const { isAuthenticated, isVerified } = useAuth();

  useEffect(() => {
    // Start animations
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
      duration: 2500,
      useNativeDriver: false,
    }).start();

    // Navigate after splash finishes
    const timer = setTimeout(() => {
      // Check auth state and route accordingly
      if (isAuthenticated && isVerified) {
        // User already logged in and verified - go to Main
        navigation.replace("Main");
      } else if (isAuthenticated && !isVerified) {
        // User logged in but not verified - go to OTP
        navigation.replace("OTPVerification", {
          phoneNumber: "", // Will be handled by OTP screen
          isSignup: true,
        });
      } else {
        // No user logged in - go to Login
        navigation.replace("Login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isVerified, navigation]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-[#111827]">
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