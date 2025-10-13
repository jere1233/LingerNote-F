import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  LoadingComponent?: React.ReactNode;
}

export default function AuthButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  LoadingComponent,
}: AuthButtonProps) {
  const getButtonClasses = () => {
    const baseClasses = 'py-4 rounded-xl items-center justify-center min-h-[52px]';
    
    if (disabled) {
      return `${baseClasses} bg-[#374151] ${className}`;
    }
    
    switch (variant) {
      case 'secondary':
        return `${baseClasses} bg-surface ${className}`;
      case 'outline':
        return `${baseClasses} bg-transparent border-2 border-[#374151] ${className}`;
      default:
        return `${baseClasses} bg-[#a855f7] shadow-lg shadow-[#a855f7]/30 ${className}`;
    }
  };

  const getTextClasses = () => {
    if (disabled) {
      return 'text-text-tertiary text-base font-bold';
    }
    
    if (variant === 'outline') {
      return 'text-[#a855f7] text-base font-bold';
    }
    
    return 'text-white text-base font-bold';
  };

  const getLoadingColor = () => {
    if (variant === 'outline') {
      return '#a855f7';
    }
    return '#ffffff';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={getButtonClasses()}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <View className="flex-row items-center justify-center">
          {LoadingComponent || (
            <ActivityIndicator color={getLoadingColor()} />
          )}
        </View>
      ) : (
        <Text className={getTextClasses()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}