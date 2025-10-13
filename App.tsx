import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <>
          <StatusBar barStyle="light-content" backgroundColor="#111827" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </>
      </AuthProvider>
    </SafeAreaProvider>
  );
}