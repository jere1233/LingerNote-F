import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator'; 

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}