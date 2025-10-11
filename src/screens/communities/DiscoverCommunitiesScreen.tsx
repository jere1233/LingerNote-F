// ============================================
// 6. Discover Communities Screen
// ============================================
// src/screens/communities/DiscoverCommunitiesScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function DiscoverCommunitiesScreen() {
  const communities = [
    { id: 1, name: "UoN Campus", icon: "🎓", gradient: "from-purple-500 to-pink-500", members: "12.5K" },
    { id: 2, name: "Nairobi Tech", icon: "💻", gradient: "from-blue-500 to-cyan-500", members: "8.3K" },
    { id: 3, name: "Music Vibes", icon: "🎵", gradient: "from-orange-500 to-red-500", members: "15.2K" },
    { id: 4, name: "Sports Corner", icon: "⚽", gradient: "from-green-500 to-emerald-500", members: "9.8K" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold text-white mb-6">Discover Communities</Text>
        
        {communities.map(c => (
          <View key={c.id} className={`bg-gradient-to-br ${c.gradient} rounded-3xl p-6 mb-4`}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-4xl mb-2">{c.icon}</Text>
                <Text className="text-xl font-bold text-white mb-1">{c.name}</Text>
                <Text className="text-white/80">{c.members} members</Text>
              </View>
              <TouchableOpacity className="px-6 py-3 bg-white rounded-full">
                <Text className="text-gray-900 font-bold">Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}