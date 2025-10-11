// src/components/common/LogoutButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

interface LogoutButtonProps {
  variant?: 'icon' | 'text' | 'full';
  onLogoutComplete?: () => void;
}

export default function LogoutButton({ 
  variant = 'full',
  onLogoutComplete 
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await logout();
              onLogoutComplete?.();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'Failed to logout. Please try again.'
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={handleLogout}
        disabled={isLoading}
        className="p-2"
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#EF4444" />
        ) : (
          <LogOut size={24} color="#EF4444" />
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'text') {
    return (
      <TouchableOpacity
        onPress={handleLogout}
        disabled={isLoading}
        className="py-2"
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#EF4444" />
        ) : (
          <Text className="text-red-500 font-semibold">Logout</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleLogout}
      disabled={isLoading}
      className="flex-row items-center justify-center bg-red-500/10 py-3 px-6 rounded-lg border border-red-500/20"
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#EF4444" />
      ) : (
        <>
          <LogOut size={20} color="#EF4444" />
          <Text className="text-red-500 font-semibold ml-2">Logout</Text>
        </>
      )}
    </TouchableOpacity>
  );
}