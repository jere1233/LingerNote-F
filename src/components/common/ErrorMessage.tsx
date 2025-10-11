import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCw, X } from 'lucide-react-native';

interface ErrorMessageProps {
  message: string;
  title?: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
  retryText?: string;
  dismissible?: boolean;
  className?: string;
}

export default function ErrorMessage({
  message,
  title,
  type = 'error',
  onRetry,
  onDismiss,
  retryText = 'Try Again',
  dismissible = false,
  className = '',
}: ErrorMessageProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-500',
          iconColor: '#eab308',
        };
      case 'info':
        return {
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-500',
          iconColor: '#3b82f6',
        };
      default:
        return {
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-500',
          iconColor: '#ef4444',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <View
      className={`${styles.bgColor} ${styles.borderColor} border rounded-xl p-4 ${className}`}
    >
      <View className="flex-row items-start">
        <AlertCircle size={20} color={styles.iconColor} className="mt-0.5" />
        
        <View className="flex-1 ml-3">
          {title && (
            <Text className={`${styles.textColor} font-semibold text-base mb-1`}>
              {title}
            </Text>
          )}
          <Text className="text-text-secondary text-sm leading-5">
            {message}
          </Text>
          
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              className="flex-row items-center mt-3 self-start"
            >
              <RefreshCw size={16} color={styles.iconColor} />
              <Text className={`${styles.textColor} text-sm font-semibold ml-2`}>
                {retryText}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {dismissible && onDismiss && (
          <TouchableOpacity onPress={onDismiss} className="ml-2">
            <X size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Simple inline error component (for form fields)
interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className = '' }: InlineErrorProps) {
  return (
    <View className={`flex-row items-center mt-1 ${className}`}>
      <AlertCircle size={12} color="#ef4444" />
      <Text className="text-red-500 text-xs ml-1">{message}</Text>
    </View>
  );
}