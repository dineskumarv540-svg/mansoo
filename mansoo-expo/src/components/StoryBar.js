import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function StoryBar({ stories, onAddStory, onStoryPress }) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* First Item: + Add Story */}
        <TouchableOpacity style={styles.storyItem} onPress={onAddStory} activeOpacity={0.8}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
              style={styles.avatarImage}
            />
            <LinearGradient
              colors={COLORS.gradientPink}
              style={styles.addBadge}
            >
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.storyName} numberOfLines={1}>+ Add Story</Text>
        </TouchableOpacity>

        {/* User Stories */}
        {stories.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.storyItem}
            onPress={() => onStoryPress(user)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={user.isVerified ? COLORS.gradientGreen : COLORS.gradientStory}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            >
              <View style={styles.whiteGap}>
                <Image source={{ uri: user.avatarUrl }} style={styles.storyAvatar} />
              </View>
            </LinearGradient>
            <Text style={styles.storyName} numberOfLines={1}>
              {user.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 68,
  },
  avatarContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  addBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBorder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    padding: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteGap: {
    width: 61,
    height: 61,
    borderRadius: 30.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  storyName: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});
