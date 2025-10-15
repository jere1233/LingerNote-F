// ============================================
// 5. Feed Screen (Home)
// ============================================
// src/screens/home/FeedScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function FeedScreen() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});

  const communities = [
    { id: 1, name: "UoN Campus", icon: "🎓", gradient: "from-purple-500 to-pink-500", members: "12.5K" },
    { id: 2, name: "Nairobi Tech", icon: "💻", gradient: "from-blue-500 to-cyan-500", members: "8.3K" },
    { id: 3, name: "Music Vibes", icon: "🎵", gradient: "from-orange-500 to-red-500", members: "15.2K" },
  ];

  const voiceNotes = [
    {
      id: 1,
      user: { name: "Amina M.", avatar: "👩🏾‍🎓", verified: true },
      community: communities[0],
      duration: "0:45",
      likes: 234,
      replies: 12,
      waveform: [0.3, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.8, 0.5, 0.6, 0.9, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7, 0.9, 0.6, 0.4],
      timeAgo: "2h ago"
    },
    {
      id: 2,
      user: { name: "Kevin O.", avatar: "👨🏿‍💻", verified: false },
      community: communities[1],
      duration: "1:12",
      likes: 456,
      replies: 28,
      waveform: [0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.5, 0.7, 0.9, 0.4, 0.6, 0.8, 0.7, 0.5, 0.9, 0.6, 0.4, 0.7, 0.8, 0.5],
      timeAgo: "4h ago"
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Vyn
          </Text>
          <Text className="text-2xl">🔔</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Community Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <TouchableOpacity className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-2">
            <Text className="text-white font-semibold">For You</Text>
          </TouchableOpacity>
          {communities.map(c => (
            <TouchableOpacity key={c.id} className="px-5 py-2 rounded-full bg-gray-800 mr-2">
              <Text className="text-gray-300 font-semibold">{c.icon} {c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Voice Notes */}
        {voiceNotes.map(note => (
          <View key={note.id} className="bg-gray-800 rounded-3xl p-5 mb-4 border border-gray-700">
            {/* User Header */}
            <View className="flex-row items-start gap-3 mb-4">
              <Text className="text-4xl">{note.user.avatar}</Text>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="font-bold text-white text-lg">{note.user.name}</Text>
                  {note.user.verified && <Text className="text-purple-400">✓</Text>}
                </View>
                <View className="flex-row items-center gap-2">
                  <View className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${note.community.gradient}`}>
                    <Text className="text-white text-xs font-medium">
                      {note.community.icon} {note.community.name}
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-sm">• {note.timeAgo}</Text>
                </View>
              </View>
            </View>

            {/* Audio Player */}
            <View className="bg-black/40 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => setPlaying(playing === note.id ? null : note.id)}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 items-center justify-center"
                >
                  <Text className="text-2xl">{playing === note.id ? '⏸️' : '▶️'}</Text>
                </TouchableOpacity>
                <View className="flex-1 flex-row items-end h-10 gap-0.5">
                  {note.waveform.map((h, i) => (
                    <View
                      key={i}
                      className={`flex-1 rounded-full ${playing === note.id ? 'bg-gradient-to-t from-purple-500 to-pink-500' : 'bg-gray-600'}`}
                      style={{ height: `${h * 100}%` }}
                    />
                  ))}
                </View>
                <Text className="text-gray-400 text-sm font-mono">{note.duration}</Text>
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => setLiked({...liked, [note.id]: !liked[note.id]})}
                className="flex-row items-center gap-2"
              >
                <Text className={`text-xl ${liked[note.id] ? '❤️' : '🤍'}`}>
                  {liked[note.id] ? '❤️' : '🤍'}
                </Text>
                <Text className={`font-semibold ${liked[note.id] ? 'text-pink-500' : 'text-gray-400'}`}>
                  {note.likes + (liked[note.id] ? 1 : 0)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-2">
                <Text className="text-xl">💬</Text>
                <Text className="font-semibold text-gray-400">{note.replies}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-xl">🔗</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}