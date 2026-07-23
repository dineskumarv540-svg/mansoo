import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import StaggeredGrid from '../components/StaggeredGrid';
import UserSuggestions from '../components/UserSuggestions';
import { DUMMY_POSTS, DUMMY_USERS, HASHTAGS } from '../data/dummyData';
import { calculateTrendingScore } from '../services/trendingAlgorithm';
import { toggleUserFollowInFirestore } from '../services/firebaseDb';
import { COLORS } from '../theme/colors';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'sparkles' },
  { id: 'Nature', name: 'Nature 🌿', icon: 'leaf' },
  { id: 'Love', name: 'Love ❤️', icon: 'heart' },
  { id: 'Politics', name: 'Politics 🏛️', icon: 'business' },
  { id: 'Humor', name: 'Humor 😂', icon: 'happy' },
  { id: 'Jokes', name: 'Jokes 🎭', icon: 'laughing' },
  { id: 'Sadness', name: 'Sadness 🌧️', icon: 'rainy' },
];

export default function ExploreScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'users', 'posts', 'hashtags'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHashtag, setSelectedHashtag] = useState('#Story');
  const [recentSearches, setRecentSearches] = useState([
    'Aarav Sharma', '#Poem', 'Love Quotes', '#Shayari', 'Nature'
  ]);
  const [followingMap, setFollowingMap] = useState({});

  // 1. Filtered Data Computation
  const queryLower = searchQuery.toLowerCase().trim();

  // Search Posts
  const matchingPosts = DUMMY_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesQuery = !queryLower ||
      post.quoteText.toLowerCase().includes(queryLower) ||
      post.authorName.toLowerCase().includes(queryLower) ||
      post.category.toLowerCase().includes(queryLower) ||
      post.authorHandle.toLowerCase().includes(queryLower);

    return matchesCategory && matchesQuery;
  }).map(p => ({
    ...p,
    trendingScore: calculateTrendingScore(p)
  }));

  // Search Users
  const matchingUsers = DUMMY_USERS.filter(user => {
    if (!queryLower) return true;
    return user.name.toLowerCase().includes(queryLower) ||
           user.handle.toLowerCase().includes(queryLower) ||
           user.bio.toLowerCase().includes(queryLower);
  });

  // Search Hashtags
  const matchingHashtags = HASHTAGS.filter(tag => {
    if (!queryLower) return true;
    return tag.toLowerCase().includes(queryLower);
  });

  // Trending Posts sorted by algorithm
  const trendingPosts = [...DUMMY_POSTS].sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a)).slice(0, 4);

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    if (!recentSearches.includes(searchQuery.trim())) {
      setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 6)]);
    }
  };

  const removeRecentSearch = (term) => {
    setRecentSearches(prev => prev.filter(t => t !== term));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
  };

  const toggleUserFollow = (user) => {
    const nextState = !followingMap[user.id];
    setFollowingMap(prev => ({ ...prev, [user.id]: nextState }));
    toggleUserFollowInFirestore(user.id, 'u1', nextState);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Realtime Search Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users, quotes, #hashtags, poetry..."
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. Scope Navigation Tabs */}
        <View style={styles.tabBar}>
          {[
            { id: 'all', label: 'All' },
            { id: 'users', label: 'Users' },
            { id: 'posts', label: 'Posts' },
            { id: 'hashtags', label: 'Hashtags' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.scopeTab, activeTab === tab.id && styles.scopeTabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.scopeTabText, activeTab === tab.id && styles.scopeTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Recent Searches (Shown when searching or on home focus) */}
        {recentSearches.length > 0 && !searchQuery && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearAllRecent}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
              {recentSearches.map(term => (
                <View key={term} style={styles.recentChip}>
                  <TouchableOpacity onPress={() => setSearchQuery(term)}>
                    <Text style={styles.recentText}>{term}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeRecentSearch(term)} style={{ marginLeft: 6 }}>
                    <Ionicons name="close" size={14} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Writing Rooms Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('WritingRooms')}
          style={{ marginBottom: 16 }}
        >
          <LinearGradient colors={COLORS.gradientGreen} style={{ borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#E53935', marginRight: 6 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Live Writing Rooms 🎙️</Text>
              </View>
              <Text style={{ color: '#E0F2F1', fontSize: 12 }}>Join writers live, write to prompts, & get real-time feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* 4. Hashtags Selector Bar */}
        {(activeTab === 'all' || activeTab === 'hashtags') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Hashtags</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hashtagsScroll}>
              {matchingHashtags.map(tag => {
                const isSelected = tag === selectedHashtag;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.hashtagChip, isSelected && styles.hashtagChipSelected]}
                    onPress={() => { setSelectedHashtag(tag); setSearchQuery(tag); }}
                  >
                    <Text style={[styles.hashtagText, isSelected && styles.hashtagTextSelected]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 5. Categories Selector */}
        {(activeTab === 'all' || activeTab === 'posts') && !searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catChip, isSelected && styles.catChipSelected]}
                    onPress={() => setSelectedCategory(cat.name)}
                  >
                    <Text style={[styles.catChipText, isSelected && styles.catChipTextSelected]}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 6. User Search Results */}
        {(activeTab === 'all' || activeTab === 'users') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Users (${matchingUsers.length})` : 'Suggested Writers'}
            </Text>

            {activeTab === 'users' ? (
              <View style={styles.usersList}>
                {matchingUsers.map(user => {
                  const isFollowing = followingMap[user.id];
                  return (
                    <View key={user.id} style={styles.userCardRow}>
                      <Image source={{ uri: user.avatarUrl }} style={styles.userCardAvatar} />
                      <View style={styles.userCardInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.userCardName}>{user.name}</Text>
                          {user.isVerified && (
                            <Ionicons name="checkmark-circle" size={14} color={COLORS.verified} style={{ marginLeft: 4 }} />
                          )}
                        </View>
                        <Text style={styles.userCardHandle}>{user.handle}</Text>
                        <Text style={styles.userCardBio} numberOfLines={1}>{user.bio}</Text>
                      </View>

                      <TouchableOpacity
                        style={[styles.followBtn, isFollowing && styles.followingBtn]}
                        onPress={() => toggleUserFollow(user)}
                      >
                        <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                          {isFollowing ? 'Following' : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <UserSuggestions users={matchingUsers} />
            )}
          </View>
        )}

        {/* 7. Trending Posts Section */}
        {activeTab === 'all' && !searchQuery && (
          <View style={styles.section}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>🔥 Trending Writing</Text>
              <Text style={styles.trendingSub}>Algorithm decay ranked</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
              {trendingPosts.map(post => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.trendingCard}
                  onPress={() => Alert.alert('Trending Post', post.quoteText)}
                >
                  <LinearGradient colors={COLORS.gradientStory} style={styles.trendingCardGradient}>
                    <Text style={styles.trendingScoreBadge}>🔥 {post.trendingScore.toFixed(1)}</Text>
                    <Text style={styles.trendingQuote} numberOfLines={3}>"{post.quoteText}"</Text>
                    <Text style={styles.trendingAuthor}>— {post.authorName}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 8. Posts Grid (Reusing StaggeredGrid) */}
        {(activeTab === 'all' || activeTab === 'posts') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Matching Quotes (${matchingPosts.length})` : 'All Quotes & Poems'}
            </Text>
            <StaggeredGrid
              posts={matchingPosts}
              onItemPress={(p) => Alert.alert('Explore Post', p.quoteText)}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scopeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 14,
    marginRight: 6,
  },
  scopeTabActive: {
    backgroundColor: COLORS.primary,
  },
  scopeTabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  scopeTabTextActive: {
    color: '#FFFFFF',
  },
  recentSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  clearText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  recentScroll: {
    flexDirection: 'row',
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  recentText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  hashtagsScroll: {
    marginTop: 8,
  },
  hashtagChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  hashtagChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  hashtagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  hashtagTextSelected: {
    color: '#FFFFFF',
  },
  catScroll: {
    marginTop: 8,
  },
  catChip: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  catChipSelected: {
    backgroundColor: COLORS.primary,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  catChipTextSelected: {
    color: '#FFFFFF',
  },
  trendingSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  trendingScroll: {
    marginTop: 10,
  },
  trendingCard: {
    width: 200,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  trendingCardGradient: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  trendingScoreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trendingQuote: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  trendingAuthor: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.9,
  },
  usersList: {
    marginTop: 10,
  },
  userCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  userCardAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  userCardInfo: {
    flex: 1,
  },
  userCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  userCardHandle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  userCardBio: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  followingBtn: {
    backgroundColor: '#E5E7EB',
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
