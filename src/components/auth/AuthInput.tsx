import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Animated,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon?: LucideIcon;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
  prefix?: string;
  isPassword?: boolean;
}

export default function AuthInput({
  label,
  icon: Icon,
  error,
  value,
  onChangeText,
  prefix,
  isPassword = false,
  ...textInputProps
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [labelAnim] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -8],
  });

  const labelSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#d1d5db', '#a855f7'],
  });

  return (
    <View className="mb-6">
      <View
        className={`flex-row items-center bg-white rounded-lg px-3 py-2 border-2 ${
          error ? 'border-red-500' : isFocused ? 'border-purple-500' : 'border-gray-300'
        }`}
      >
        {Icon && (
          <Icon
            size={18}
            color={error ? '#ef4444' : isFocused ? '#a855f7' : '#9ca3af'}
            className="mr-2"
          />
        )}

        <View className="flex-1 relative">
          <Animated.Text
            style={[
              {
                position: 'absolute',
                top: labelTop,
                fontSize: labelSize,
                color: labelColor,
              },
            ]}
            className="font-semibold left-0 bg-white px-1 mx-1"
          >
            {label}
          </Animated.Text>

          {prefix && (
            <Text className="text-gray-600 text-base mr-2 mt-3">{prefix}</Text>
          )}

          <TextInput
            className="flex-1 text-gray-900 text-base py-3 font-medium"
            placeholderTextColor="#d1d5db"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isPassword && !showPassword}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...textInputProps}
          />
        </View>

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-2"
          >
            {showPassword ? (
              <EyeOff size={20} color={isFocused ? '#a855f7' : '#9ca3af'} />
            ) : (
              <Eye size={20} color={isFocused ? '#a855f7' : '#9ca3af'} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-xs mt-2 ml-3 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}