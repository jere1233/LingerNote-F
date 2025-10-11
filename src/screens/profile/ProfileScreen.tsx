// ============================================
// 7. Profile Screen
// ============================================
// src/screens/profile/ProfileScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function ProfileScreen() {
  const communities = [
    { id: 1, name: "UoN Campus", icon: "🎓", gradient: "from-purple-500 to-pink-500", members: "12.5K" },
    { id: 2, name: "Nairobi Tech", icon: "💻", gradient: "from-blue-500 to-cyan-500", members: "8.3K" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        {/* Cover + Avatar */}
        <View className="relative mb-6">
          <View className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-b-3xl" />
          <View className="absolute -bottom-12 left-6">
            <View className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 items-center justify-center border-4 border-gray-900">
              <Text className="text-5xl">👨🏾‍💻</Text>
            </View>
          </View>
        </View>

        <View className="mt-14 px-6">
          {/* Profile Info */}
          <View className="flex-row items-start justify-between mb-4">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-2xl font-bold text-white">John Doe</Text>
                <Text className="text-purple-400">✓</Text>
              </View>
              <Text className="text-gray-400">@johndoe</Text>
            </View>
            <TouchableOpacity className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Text className="text-white font-semibold">Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-gray-300 mb-6">
            Tech enthusiast | Voice lover | Building cool stuff 🚀
          </Text>

          {/* Stats */}
          <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-gray-800 rounded-2xl p-4 items-center">
              <Text className="text-2xl font-bold text-white mb-1">142</Text>
              <Text className="text-sm text-gray-400">Voice Notes</Text>
            </View>
            <View className="flex-1 bg-gray-800 rounded-2xl p-4 items-center">
              <Text className="text-2xl font-bold text-white mb-1">1.2K</Text>
              <Text className="text-sm text-gray-400">Followers</Text>
            </View>
            <View className="flex-1 bg-gray-800 rounded-2xl p-4 items-center">
              <Text className="text-2xl font-bold text-white mb-1">8.5K</Text>
              <Text className="text-sm text-gray-400">Likes</Text>
            </View>
          </View>

          {/* Communities */}
          <Text className="text-lg font-bold text-white mb-3">My Communities</Text>
          <View className="flex-row flex-wrap gap-3">
            {communities.map(c => (
              <View key={c.id} className={`w-[48%] bg-gradient-to-br ${c.gradient} rounded-2xl p-4`}>
                <Text className="text-3xl mb-2">{c.icon}</Text>
                <Text className="font-bold text-white mb-1">{c.name}</Text>
                <Text className="text-sm text-white/80">{c.members} members</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
