import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { toggleUserFollowInFirestore } from '../services/firebaseDb';
import { triggerNotification } from '../services/notificationService';

export default function UserSuggestions({ users = [] }) {
  const [followingMap, setFollowingMap] = useState({});

  const toggleFollow = (user) => {
    const nextState = !followingMap[user.id];
    setFollowingMap(prev => ({ ...prev, [user.id]: nextState }));

    toggleUserFollowInFirestore(user.id, 'u1', nextState);

    if (nextState) {
      triggerNotification({
        recipientId: user.id,
        senderId: 'u1',
        senderName: 'Aarav Sharma',
        senderAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        type: 'follow',
        actionText: 'started following you.',
      });
    }
  };

  if (!users || users.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>People You May Know</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {users.map((user) => {
          const isFollowing = followingMap[user.id];
          return (
            <View key={user.id} style={styles.card}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                {user.isVerified && (
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.verified} style={styles.verifiedIcon} />
                )}
              </View>

              <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
              <Text style={styles.handle} numberOfLines={1}>{user.handle}</Text>

              {user.isPro && (
                <View style={styles.proBadge}>
                  <Text style={styles.proText}>PRO</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={() => toggleFollow(user)}
                activeOpacity={0.8}
              >
                <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderBottomWidth: 6,
    borderBottomColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    width: 140,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  verifiedIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  handle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  proBadge: {
    backgroundColor: COLORS.proGold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  proText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  followBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  followingBtn: {
    backgroundColor: '#E0E0E0',
  },
  followBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  followingBtnText: {
    color: COLORS.textPrimary,
  },
});
