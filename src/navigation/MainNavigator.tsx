// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { Home, Search, PlusCircle, User } from 'lucide-react-native';
import FeedScreen from '../screens/home/FeedScreen';
import DiscoverCommunitiesScreen from '../screens/communities/DiscoverCommunitiesScreen';
import RecordVoiceScreen from '../screens/record/RecordVoiceScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type MainTabParamList = {
  Feed: undefined;
  Discover: undefined;
  Record: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: '#1f2937',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: '#a855f7',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: focused ? '#a855f7' + '20' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Home size={24} color={color} fill={focused ? color : 'none'} />
            </View>
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverCommunitiesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: focused ? '#a855f7' + '20' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Record"
        component={RecordVoiceScreen}
        options={{
          tabBarIcon: () => (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                marginTop: -20,
                shadowColor: '#a855f7',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 items-center justify-center"
            >
              <PlusCircle size={28} color="white" />
            </View>
          ),
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: focused ? '#a855f7' + '20' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={24} color={color} fill={focused ? color : 'none'} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}



