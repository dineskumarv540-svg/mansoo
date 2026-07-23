import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { WeeklyVisitorsChart, EngagementFunnelChart } from '../components/AnalyticsCharts';
import { fetchAnalyticsOverview } from '../services/analyticsService';
import { COLORS } from '../theme/colors';

export default function AnalyticsScreen({ navigation }) {
  const [timeRange, setTimeRange] = useState('30d'); // '7d' | '30d' | '90d' | 'all'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    const res = await fetchAnalyticsOverview('u1', timeRange);
    setData(res);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Aggregating Analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Analytics Dashboard</Text>

        <TouchableOpacity onPress={loadAnalytics}>
          <Ionicons name="refresh-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Time Period Selector */}
        <View style={styles.timeTabRow}>
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: 'all', label: 'All Time' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.timeTab, timeRange === tab.id && styles.timeTabActive]}
              onPress={() => setTimeRange(tab.id)}
            >
              <Text style={[styles.timeTabText, timeRange === tab.id && styles.timeTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 1. Writing Streak & Reading Time Hero Banner */}
        <LinearGradient colors={COLORS.gradientGreen} style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroBadgeText}>STREAK 🔥</Text>
              <Text style={styles.heroValText}>{data.writingStreakDays} Days</Text>
              <Text style={styles.heroSubText}>Active Writing</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroStat}>
              <Text style={styles.heroBadgeText}>AVG READ ⏱️</Text>
              <Text style={styles.heroValText}>{data.avgReadingTimeMinutes}</Text>
              <Text style={styles.heroSubText}>Per Quote Post</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroStat}>
              <Text style={styles.heroBadgeText}>ENGAGEMENT 🎯</Text>
              <Text style={styles.heroValText}>{data.engagementRate}</Text>
              <Text style={styles.heroSubText}>Top 5% Writer</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 2. Key Metrics Grid (Views, Reads, Likes, Comments, Shares, Saves) */}
        <Text style={styles.sectionHeader}>📈 Key Performance Indicators</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Ionicons name="eye" size={20} color="#0F3D3E" />
            <Text style={styles.metricVal}>{(data.totalViews / 1000).toFixed(1)}K</Text>
            <Text style={styles.metricLabel}>Total Views</Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="book" size={20} color="#1A237E" />
            <Text style={styles.metricVal}>{(data.totalReads / 1000).toFixed(1)}K</Text>
            <Text style={styles.metricLabel}>Reads</Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="heart" size={20} color="#E91E63" />
            <Text style={styles.metricVal}>{(data.totalLikes / 1000).toFixed(1)}K</Text>
            <Text style={styles.metricLabel}>Likes</Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="chatbubble" size={20} color="#2196F3" />
            <Text style={styles.metricVal}>{data.totalComments}</Text>
            <Text style={styles.metricLabel}>Comments</Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="share-social" size={20} color="#009688" />
            <Text style={styles.metricVal}>{data.totalShares}</Text>
            <Text style={styles.metricLabel}>Shares</Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="bookmark" size={20} color="#FF9800" />
            <Text style={styles.metricVal}>{data.totalSaves}</Text>
            <Text style={styles.metricLabel}>Saves</Text>
          </View>
        </View>

        {/* 3. Audience Visitors & Growth */}
        <View style={styles.audienceCard}>
          <Text style={styles.cardTitle}>👥 Audience & Growth Traffic</Text>
          <View style={styles.growthRow}>
            <View style={styles.growthItem}>
              <Text style={styles.growthVal}>{data.dailyVisitors}</Text>
              <Text style={styles.growthLabel}>Daily Visitors</Text>
            </View>
            <View style={styles.growthItem}>
              <Text style={styles.growthVal}>{(data.weeklyVisitors / 1000).toFixed(1)}K</Text>
              <Text style={styles.growthLabel}>Weekly Visitors</Text>
            </View>
            <View style={styles.growthItem}>
              <Text style={styles.growthVal}>{(data.monthlyVisitors / 1000).toFixed(1)}K</Text>
              <Text style={styles.growthLabel}>Monthly Visitors</Text>
            </View>
          </View>

          <View style={styles.growthPillRow}>
            <View style={styles.growthPill}>
              <Ionicons name="trending-up" size={14} color="#4CAF50" />
              <Text style={styles.growthPillText}>Followers: {data.followersGrowthPercent} ({data.followersGrowth})</Text>
            </View>
          </View>
        </View>

        {/* 4. Weekly Visitors Chart */}
        <WeeklyVisitorsChart data={data.weeklyVisitorData} />

        {/* 5. Engagement Funnel Chart */}
        <EngagementFunnelChart
          views={data.totalViews}
          reads={data.totalReads}
          likes={data.totalLikes}
          shares={data.totalShares}
        />

        {/* 6. Best Performing Posts */}
        <View style={styles.bestPostsCard}>
          <Text style={styles.cardTitle}>🏆 Best Performing Posts</Text>
          {data.bestPerformingPosts.map((post, idx) => (
            <View key={post.id} style={styles.postRankRow}>
              <Text style={styles.rankNum}>#{idx + 1}</Text>
              <View style={styles.postRankInfo}>
                <Text style={styles.postQuoteSnippet} numberOfLines={1}>"{post.quoteText}"</Text>
                <Text style={styles.postMetaText}>
                  ❤️ {post.likesCount} • 💬 {post.commentsCount} • 🔗 {post.sharesCount}
                </Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreBadgeText}>{post.performanceScore} pts</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 10,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  timeTabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  timeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  timeTabActive: {
    backgroundColor: COLORS.primary,
  },
  timeTabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  timeTabTextActive: {
    color: '#FFFFFF',
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  heroStat: {
    alignItems: 'center',
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    opacity: 0.85,
    marginBottom: 2,
  },
  heroValText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroSubText: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metricCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  audienceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  growthRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
  },
  growthItem: {
    alignItems: 'center',
  },
  growthVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  growthLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  growthPillRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  growthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  growthPillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 6,
  },
  bestPostsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  postRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rankNum: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
    width: 28,
  },
  postRankInfo: {
    flex: 1,
  },
  postQuoteSnippet: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  postMetaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: '#F0F7F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scoreBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
