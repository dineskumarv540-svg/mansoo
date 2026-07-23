import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import MilestoneCelebrationModal from '../components/MilestoneCelebrationModal';
import {
  getUserGamificationProgress,
  claimChallengeReward,
  BADGES_LIBRARY,
  UNLOCKABLE_THEMES,
  TOP_WRITERS_LEADERBOARD
} from '../services/gamificationService';
import { COLORS } from '../theme/colors';

export default function GamificationScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('challenges'); // 'challenges', 'badges', 'leaderboard', 'themes'
  const [progress, setProgress] = useState(getUserGamificationProgress());
  const [celebrationData, setCelebrationData] = useState(null);
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const handleClaim = (challengeId) => {
    const res = claimChallengeReward(challengeId);
    if (res.success) {
      setProgress({ ...getUserGamificationProgress() });
      setCelebrationData(res);
      setCelebrationVisible(true);
    }
  };

  const xpPercent = Math.min(100, (progress.xp / progress.nextLevelXp) * 100);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Writer Level & Rewards</Text>

        <View style={styles.streakBadgeHeader}>
          <Text style={styles.streakBadgeText}>🔥 {progress.streakDays} Days</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 1. Level & XP Hero Card */}
        <LinearGradient colors={COLORS.gradientGreen} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.levelBadgeCircle}>
              <Ionicons name="trophy" size={24} color="#FFD54F" />
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroLevelTitle}>{progress.levelTitle}</Text>
              <Text style={styles.heroLevelSub}>Level {progress.level} Writer</Text>
            </View>
            <View style={styles.xpBox}>
              <Text style={styles.xpVal}>{progress.xp} XP</Text>
            </View>
          </View>

          {/* XP Progress Bar */}
          <View style={styles.xpProgressTrack}>
            <LinearGradient colors={COLORS.gradientPink} style={[styles.xpProgressFill, { width: `${xpPercent}%` }]} />
          </View>

          <View style={styles.xpProgressMeta}>
            <Text style={styles.xpMetaText}>{progress.xp} / {progress.nextLevelXp} XP to Level {progress.level + 1}</Text>
            <Text style={styles.xpMetaText}>{(progress.nextLevelXp - progress.xp)} XP Left</Text>
          </View>
        </LinearGradient>

        {/* 2. Navigation Tabs */}
        <View style={styles.tabRow}>
          {[
            { id: 'challenges', label: 'Challenges' },
            { id: 'badges', label: 'Badges' },
            { id: 'leaderboard', label: 'Leaderboard' },
            { id: 'themes', label: 'Themes' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Tab Contents */}

        {/* A. Challenges */}
        {activeTab === 'challenges' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🎯 Writing Quests & Prompts</Text>
            {progress.challenges.map(item => (
              <View key={item.id} style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <View style={styles.typeTag}>
                    <Text style={styles.typeTagText}>{item.type} Quest</Text>
                  </View>
                  <Text style={styles.rewardXpText}>+{item.rewardXp} XP</Text>
                </View>

                <Text style={styles.challengeTitle}>{item.title}</Text>

                <TouchableOpacity
                  style={[styles.claimBtn, item.completed && styles.claimBtnCompleted]}
                  onPress={() => handleClaim(item.id)}
                  disabled={item.completed}
                >
                  <Text style={[styles.claimBtnText, item.completed && styles.claimBtnTextCompleted]}>
                    {item.completed ? 'Claimed ✅' : 'Claim Reward (+50 XP)'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* B. Badges */}
        {activeTab === 'badges' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🏅 Achievement Badges</Text>
            <View style={styles.badgesGrid}>
              {BADGES_LIBRARY.map(badge => (
                <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}>
                  <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeDesc}>{badge.description}</Text>
                  {badge.unlocked ? (
                    <Text style={styles.unlockedTag}>Unlocked ✅</Text>
                  ) : (
                    <Text style={styles.lockedTag}>Locked 🔒</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* C. Leaderboard */}
        {activeTab === 'leaderboard' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>👑 Top Writers Leaderboard</Text>
            {TOP_WRITERS_LEADERBOARD.map((writer) => (
              <View key={writer.id} style={styles.leaderboardRow}>
                <Text style={styles.rankNum}>#{writer.rank}</Text>
                <Image source={{ uri: writer.avatar }} style={styles.leaderboardAvatar} />

                <View style={styles.leaderboardInfo}>
                  <Text style={styles.leaderboardName}>{writer.name}</Text>
                  <Text style={styles.leaderboardSub}>{writer.levelTitle} • Level {writer.level}</Text>
                </View>

                <View style={styles.xpPill}>
                  <Text style={styles.xpPillText}>{writer.xp} XP</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* D. Unlockable Themes */}
        {activeTab === 'themes' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🎨 Unlockable Studio Themes</Text>
            <View style={styles.themesGrid}>
              {UNLOCKABLE_THEMES.map(theme => (
                <View key={theme.id} style={styles.themeCard}>
                  <LinearGradient colors={theme.colors} style={styles.themePreviewGradient} />
                  <View style={styles.themeMeta}>
                    <Text style={styles.themeName}>{theme.name}</Text>
                    <Text style={styles.themeLevelReq}>
                      {theme.unlocked ? 'Unlocked ✅' : `Requires Level ${theme.requiredLevel}`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Milestone Celebration Popup */}
      <MilestoneCelebrationModal
        visible={celebrationVisible}
        rewardData={celebrationData}
        onClose={() => setCelebrationVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'serif',
  },
  streakBadgeHeader: {
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  streakBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  scrollContent: {
    padding: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heroInfo: {
    flex: 1,
  },
  heroLevelTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroLevelSub: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.85,
  },
  xpBox: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpVal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  xpProgressTrack: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  xpProgressFill: {
    height: '100%',
    borderRadius: 5,
  },
  xpProgressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpMetaText: {
    color: '#FFFFFF',
    fontSize: 11,
    opacity: 0.9,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sectionContainer: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeTag: {
    backgroundColor: '#F0F7F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  rewardXpText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  challengeTitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 12,
  },
  claimBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  claimBtnCompleted: {
    backgroundColor: '#E5E7EB',
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  claimBtnTextCompleted: {
    color: COLORS.textPrimary,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  badgeDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: 4,
  },
  unlockedTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 4,
  },
  lockedTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  rankNum: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
    width: 28,
  },
  leaderboardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  leaderboardSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  xpPill: {
    backgroundColor: '#F0F7F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  xpPillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  themePreviewGradient: {
    height: 80,
    width: '100%',
  },
  themeMeta: {
    padding: 10,
  },
  themeName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  themeLevelReq: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
