import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import StaggeredGrid from '../components/StaggeredGrid';
import { DUMMY_POSTS, DUMMY_USERS } from '../data/dummyData';
import { COLORS } from '../theme/colors';

import { useAuth } from '../context/AuthContext';
import EmailVerificationBanner from '../components/EmailVerificationBanner';

export default function ProfileScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState(0); // 0: Posts, 1: Saved, 2: Liked
  const { user, logout, deleteAccount } = useAuth();
  const displayUser = user || DUMMY_USERS[0];

  const userPosts = DUMMY_POSTS.filter(p => p.authorId === displayUser.uid || p.authorName === displayUser.name || p.authorName === 'Aarav Sharma');
  const savedPosts = DUMMY_POSTS.filter(p => p.isSaved);
  const likedPosts = DUMMY_POSTS.filter(p => p.isLiked);

  const currentPosts = selectedTab === 0 ? userPosts : selectedTab === 1 ? savedPosts : likedPosts;

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            if (navigation) navigation.replace('Login');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your posts, followers, and profile data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteAccount();
            if (res.success) {
              Alert.alert('Account Deleted', 'Your account has been deleted.');
              if (navigation) navigation.replace('Login');
            } else {
              Alert.alert('Action Failed', res.error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <EmailVerificationBanner />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200' }}
            style={styles.coverImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.9)', '#FFFFFF']}
            style={styles.coverGradient}
          />
          {/* Settings / Logout Quick Trigger */}
          <TouchableOpacity style={styles.settingsBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Info Header */}
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <LinearGradient colors={COLORS.gradientStory} style={styles.avatarGradient}>
            <View style={styles.avatarWhiteGap}>
              <Image source={{ uri: displayUser.photoURL || displayUser.avatarUrl }} style={styles.avatar} />
            </View>
          </LinearGradient>

          {/* Name & Badge */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{displayUser.displayName || displayUser.name}</Text>
            {displayUser.isVerified && (
              <Ionicons name="checkmark-circle" size={18} color={COLORS.verified} style={{ marginLeft: 4 }} />
            )}
            {displayUser.isPro && (
              <View style={styles.proBadge}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            )}
          </View>

          <Text style={styles.handle}>{displayUser.handle || `@${(displayUser.displayName || 'writer').toLowerCase().replace(/\s+/g, '_')}`}</Text>

          {/* Bio */}
          <Text style={styles.bio}>{displayUser.bio || 'Writing the language of the soul ✨'}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{displayUser.postsCount || 480}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>14.2K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{displayUser.followingCount || 312}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.editBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={16} color={COLORS.textPrimary} />
              <Text style={styles.editBtnText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
              <Ionicons name="trash-outline" size={16} color={COLORS.error} />
              <Text style={[styles.editBtnText, { color: COLORS.error }]}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tab, selectedTab === 0 && styles.tabActive]} onPress={() => setSelectedTab(0)}>
            <Ionicons name="grid-outline" size={20} color={selectedTab === 0 ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabText, selectedTab === 0 && styles.tabTextActive]}>Posts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tab, selectedTab === 1 && styles.tabActive]} onPress={() => setSelectedTab(1)}>
            <Ionicons name="bookmark-outline" size={20} color={selectedTab === 1 ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabText, selectedTab === 1 && styles.tabTextActive]}>Saved</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tab, selectedTab === 2 && styles.tabActive]} onPress={() => setSelectedTab(2)}>
            <Ionicons name="heart-outline" size={20} color={selectedTab === 2 ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabText, selectedTab === 2 && styles.tabTextActive]}>Liked</Text>
          </TouchableOpacity>
        </View>

        {/* Post Grid */}
        <StaggeredGrid
          posts={currentPosts}
          onItemPress={(p) => Alert.alert('Profile Post', p.quoteText)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  coverContainer: {
    height: 140,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  settingsBtn: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    borderRadius: 12,
    paddingVertical: 10,
    marginLeft: 8,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -45,
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWhiteGap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  proBadge: {
    backgroundColor: COLORS.proGold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  proText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  handle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bio: {
    fontSize: 13,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  websiteText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#EEEEEE',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
    width: '100%',
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingVertical: 10,
    marginLeft: 8,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
});
