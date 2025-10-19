import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
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
  return (
    <View className="mb-3">
      <Text className="text-sm text-gray-700 mb-2 font-semibold">
        {label}
      </Text>
      
      <View
        className={`flex-row items-center bg-white rounded-lg px-3 border-2 border-black`}
      >
        {Icon && <Icon size={18} color="#9ca3af" className="mr-2" />}
        
        {prefix && (
          <Text className="text-gray-600 text-base mr-2">{prefix}</Text>
        )}
        
        <TextInput
          className="flex-1 text-gray-900 text-base py-3 font-medium"
          placeholderTextColor="#d1d5db"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          {...textInputProps}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-2"
          >
            {showPassword ? (
              <EyeOff size={20} color="#9ca3af" />
            ) : (
              <Eye size={20} color="#9ca3af" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-2 ml-1">{error}</Text>
      )}
    </View>
  );
}