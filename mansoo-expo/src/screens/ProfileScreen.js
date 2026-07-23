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
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import EditProfileModal from '../components/EditProfileModal';
import SettingsModal from '../components/SettingsModal';
import QRCodeModal from '../components/QRCodeModal';
import ShareSheetModal from '../components/ShareSheetModal';
import DeleteAccountModal from '../components/DeleteAccountModal';

import { DUMMY_POSTS, DUMMY_USERS } from '../data/dummyData';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState(0); // 0: Posts, 1: Saved, 2: Liked
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [shareProfileVisible, setShareProfileVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const { user, logout, deleteAccount } = useAuth();
  const initialUser = user || DUMMY_USERS[0];

  const [profileData, setProfileData] = useState({
    name: initialUser.displayName || initialUser.name || 'Aarav Sharma',
    displayName: initialUser.displayName || initialUser.name || 'Aarav Sharma',
    handle: initialUser.handle || '@aarav_writes',
    bio: initialUser.bio || 'Poet & Dreamer 🌙 | Author of "Echoes of Silence" | Writing the language of the soul',
    website: initialUser.website || 'mansoo.in/aarav',
    avatarUrl: initialUser.photoURL || initialUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    coverImageUrl: initialUser.coverImageUrl || 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200',
    isVerified: true,
    isPro: true,
    followersCount: 14200,
    followingCount: 312,
    postsCount: 480,
  });

  const userPosts = DUMMY_POSTS.filter(p => p.authorId === initialUser.uid || p.authorName === profileData.name || p.authorName === 'Aarav Sharma');
  const savedPosts = DUMMY_POSTS.filter(p => p.isSaved);
  const likedPosts = DUMMY_POSTS.filter(p => p.isLiked);

  const currentPosts = selectedTab === 0 ? userPosts : selectedTab === 1 ? savedPosts : likedPosts;

  const handleUpdateProfile = (updatedFields) => {
    setProfileData(prev => ({ ...prev, ...updatedFields }));
    Alert.alert('Profile Updated ✨', 'Your profile details have been saved.');
  };

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
          <Image source={{ uri: profileData.coverImageUrl }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.9)', '#FFFFFF']}
            style={styles.coverGradient}
          />
          {/* Settings Trigger */}
          <TouchableOpacity style={styles.settingsBtn} onPress={() => setSettingsModalVisible(true)}>
            <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Info Header */}
        <View style={styles.profileHeader}>
          {/* Profile Photo Avatar */}
          <LinearGradient colors={COLORS.gradientStory} style={styles.avatarGradient}>
            <View style={styles.avatarWhiteGap}>
              <Image source={{ uri: profileData.avatarUrl }} style={styles.avatar} />
            </View>
          </LinearGradient>

          {/* Name & Badges */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profileData.name}</Text>
            {profileData.isVerified && (
              <Ionicons name="checkmark-circle" size={18} color={COLORS.verified} style={{ marginLeft: 4 }} />
            )}
            {profileData.isPro && (
              <View style={styles.proBadge}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            )}
          </View>

          <Text style={styles.handle}>{profileData.handle}</Text>

          {/* Bio */}
          <Text style={styles.bio}>{profileData.bio}</Text>

          {/* Website Link */}
          {profileData.website ? (
            <TouchableOpacity style={styles.websiteRow}>
              <Ionicons name="link-outline" size={14} color={COLORS.primary} />
              <Text style={styles.websiteText}>{profileData.website}</Text>
            </TouchableOpacity>
          ) : null}

          {/* Realtime Counters Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>14.2K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Action Buttons Row 1 */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Premium')}>
              <Text style={{ fontSize: 13, marginRight: 2 }}>👑</Text>
              <Text style={[styles.editBtnText, { color: '#E65100' }]}>PRO</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editBtn} onPress={() => setEditModalVisible(true)}>
              <Ionicons name="create-outline" size={16} color={COLORS.textPrimary} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Gamification')}>
              <Ionicons name="trophy-outline" size={16} color={COLORS.accent} />
              <Text style={[styles.editBtnText, { color: COLORS.accent }]}>Rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Analytics')}>
              <Ionicons name="bar-chart-outline" size={16} color={COLORS.primary} />
              <Text style={[styles.editBtnText, { color: COLORS.primary }]}>Analytics</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons Row 2: Share & QR */}
          <View style={[styles.actionsRow, { marginTop: 0 }]}>
            <TouchableOpacity style={styles.editBtn} onPress={() => setShareProfileVisible(true)}>
              <Ionicons name="share-social-outline" size={16} color={COLORS.primary} />
              <Text style={[styles.editBtnText, { color: COLORS.primary }]}>Share Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editBtn} onPress={() => setQrModalVisible(true)}>
              <Ionicons name="qr-code-outline" size={16} color="#E65100" />
              <Text style={[styles.editBtnText, { color: '#E65100' }]}>My QR Code</Text>
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

        {/* Posts Grid (Reusing StaggeredGrid) */}
        <StaggeredGrid
          posts={currentPosts}
          onItemPress={(p) => Alert.alert('Profile Post', p.quoteText)}
        />
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={editModalVisible}
        user={profileData}
        onClose={() => setEditModalVisible(false)}
        onSave={handleUpdateProfile}
      />

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        onLogout={logout}
        onDeleteAccount={() => setDeleteModalVisible(true)}
        navigation={navigation}
      />

      <DeleteAccountModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
      />

      <QRCodeModal
        visible={qrModalVisible}
        targetItem={{ id: profileData.handle, name: profileData.name, displayName: profileData.name }}
        type="profile"
        onClose={() => setQrModalVisible(false)}
      />

      <ShareSheetModal
        visible={shareProfileVisible}
        targetItem={{ id: profileData.handle, name: profileData.name, authorName: profileData.name }}
        type="profile"
        onClose={() => setShareProfileVisible(false)}
      />
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
  settingsActionBtn: {
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
