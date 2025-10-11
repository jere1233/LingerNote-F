import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

export default function LoadingSpinner({
  size = 'large',
  color = '#a855f7',
  message,
  fullScreen = false,
  overlay = false,
  className = '',
}: LoadingSpinnerProps) {
  const content = (
    <View className={`items-center justify-center ${fullScreen ? 'absolute inset-0 bg-background' : ''} ${className}`}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="text-text-secondary text-sm mt-4 text-center px-6">
          {message}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View className="absolute inset-0 bg-black/50 z-50 items-center justify-center">
        {content}
      </View>
    );
  }

  return content;
}