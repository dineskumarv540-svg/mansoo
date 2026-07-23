import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StoryBar from '../components/StoryBar';
import FeaturedSection from '../components/FeaturedSection';
import UserSuggestions from '../components/UserSuggestions';
import PostCard from '../components/PostCard';
import PostOptionsSheet from '../components/PostOptionsSheet';
import CommentsModal from '../components/CommentsModal';
import DailyChallengeCard from '../components/DailyChallengeCard';
import AdBanner from '../components/AdBanner';
import { PostCardSkeleton, StoryBarSkeleton } from '../components/SkeletonLoaders';

import { DUMMY_POSTS, DUMMY_STORIES, DUMMY_USERS } from '../data/dummyData';
import { fetchPostsFeed, togglePostLikeInFirestore } from '../services/firebaseDb';
import { getCachedFeed, updateCachedFeed, updatePostInCache } from '../services/feedCacheService';
import { getTodayChallenge } from '../services/challengeService';
import { COLORS } from '../theme/colors';

import { sharePost, blockUser, submitReport } from '../services/socialService';
import { triggerNotification } from '../services/notificationService';

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState(getCachedFeed());
  const [initialLoading, setInitialLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [selectedPost, setSelectedPost] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const featuredPosts = posts.filter(p => p.isFeatured).slice(0, 3);
  const todayChallenge = getTodayChallenge();

  // Initial feed load
  useEffect(() => {
    loadInitialFeed();
  }, []);

  const loadInitialFeed = async () => {
    if (posts.length === 0) setInitialLoading(true);

    const { posts: newPosts, lastDoc: newLastDoc } = await fetchPostsFeed(null, 6);
    setPosts(newPosts);
    updateCachedFeed(newPosts);
    setLastDoc(newLastDoc);
    setInitialLoading(false);
  };

  // Pull to Refresh Handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const { posts: newPosts, lastDoc: newLastDoc } = await fetchPostsFeed(null, 6);
    setPosts(newPosts);
    updateCachedFeed(newPosts);
    setLastDoc(newLastDoc);
    setHasMore(true);
    setRefreshing(false);
  }, []);

  // Infinite Scroll Pagination Handler
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || refreshing) return;

    setLoadingMore(true);
    const { posts: nextPosts, lastDoc: nextLastDoc } = await fetchPostsFeed(lastDoc, 5);

    if (nextPosts.length === 0 || !nextLastDoc) {
      setHasMore(false);
    } else {
      const mergedPosts = [...posts, ...nextPosts];
      setPosts(mergedPosts);
      updateCachedFeed(mergedPosts);
      setLastDoc(nextLastDoc);
    }
    setLoadingMore(false);
  };

  // Optimistic UI Like Handler with Notification Trigger
  const handleOptimisticLike = (targetPost) => {
    const nextLiked = !targetPost.isLiked;
    const nextCount = targetPost.likesCount + (nextLiked ? 1 : -1);

    const updated = { isLiked: nextLiked, likesCount: nextCount };

    // 1. Instant client-side state update
    setPosts(prev => prev.map(p => (p.id === targetPost.id ? { ...p, ...updated } : p)));
    updatePostInCache(targetPost.id, updated);

    // 2. Background Firestore sync
    togglePostLikeInFirestore(targetPost.id, 'u1', nextLiked);

    // 3. Trigger Notification
    if (nextLiked) {
      triggerNotification({
        recipientId: targetPost.authorId,
        senderId: 'u1',
        senderName: 'Aarav Sharma',
        senderAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        type: 'like',
        actionText: `liked your post: "${targetPost.quoteText.slice(0, 30)}..."`,
        postId: targetPost.id,
      });
    }
  };

  const handleOptionsPress = (post) => {
    setSelectedPost(post);
    setSheetVisible(true);
  };

  const handleCommentPress = (post) => {
    setSelectedPost(post);
    setCommentsVisible(true);
  };

  const handleOptionSelect = async (action) => {
    if (!selectedPost) return;

    if (action === 'Share to Story' || action === 'Copy Link') {
      await sharePost(selectedPost);
      Alert.alert('Shared! ✨', `${action} completed.`);
    } else if (action === 'Block User') {
      Alert.alert(
        'Block User',
        `Are you sure you want to block ${selectedPost.authorName}? You won't see their posts anymore.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Block',
            style: 'destructive',
            onPress: async () => {
              await blockUser('u1', selectedPost.authorId, selectedPost.authorName);
              setPosts(prev => prev.filter(p => p.authorId !== selectedPost.authorId));
              Alert.alert('Blocked', `${selectedPost.authorName} has been blocked.`);
            }
          }
        ]
      );
    } else if (action === 'Report Post') {
      const res = await submitReport({
        contentId: selectedPost.id,
        contentType: 'post',
        reportedByUserId: 'u1',
        reason: 'Inappropriate Content',
      });
      Alert.alert('Report Submitted', res.message);
    } else if (action === 'Edit Post') {
      navigation.navigate('Create', { editPost: selectedPost });
    } else if (action === 'Delete Post') {
      Alert.alert(
        'Delete Post',
        'Are you sure you want to permanently delete this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const targetId = selectedPost.id;
              setPosts(prev => prev.filter(p => p.id !== targetId));
              const { deletePostFromFirestore } = require('../services/firebaseDb');
              await deletePostFromFirestore(targetId);
              Alert.alert('Post Deleted', 'Your post has been removed.');
            }
          }
        ]
      );
    } else {
      Alert.alert('Action Selected', action);
    }
  };

  const renderHeader = () => (
    <View>
      {/* 1. Stories Section */}
      <StoryBar
        stories={DUMMY_STORIES}
        onAddStory={() => Alert.alert('Story', 'Open Story Creator')}
        onStoryPress={(user) => Alert.alert('Story', `View story of ${user.name}`)}
      />

      {/* 2. Daily Writing Challenge */}
      <DailyChallengeCard
        challenge={todayChallenge}
        onWritePress={() => navigation.navigate('Create')}
      />

      {/* 3. Featured Section */}
      <FeaturedSection
        featuredPosts={featuredPosts.length > 0 ? featuredPosts : DUMMY_POSTS.slice(0, 3)}
        onPostPress={(post) => Alert.alert('Featured Post', post.quoteText)}
      />

      {/* 4. User Suggestions Carousel */}
      <UserSuggestions users={DUMMY_USERS.slice(1)} />

      {/* 5. AdMob Monetization Banner */}
      <AdBanner />

      {/* Feed Subtitle */}
      <View style={styles.feedHeaderRow}>
        <Text style={styles.feedTitle}>Recent Feed</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 20 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={COLORS.primary} size="small" />
        <Text style={styles.loadingMoreText}>Loading more posts...</Text>
      </View>
    );
  };

  const keyExtractor = useCallback((item) => item.id, []);

  const renderPostItem = useCallback(({ item }) => (
    <PostCard
      post={item}
      onLikeClick={handleOptimisticLike}
      onOptionsPress={handleOptionsPress}
      onCommentPress={handleCommentPress}
      onSharePress={(p) => Alert.alert('Share', `Share post ${p.id}`)}
    />
  ), []);

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StoryBarSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.appTitle}>Mansoo</Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>4</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Feed with Infinite Scroll & Pull-to-Refresh */}
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderPostItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary, COLORS.accent]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
      />

      {/* 3-Dot Options Bottom Sheet */}
      <PostOptionsSheet
        visible={sheetVisible}
        post={selectedPost}
        onClose={() => setSheetVisible(false)}
        onOptionSelect={handleOptionSelect}
      />

      {/* Comments Modal */}
      <CommentsModal
        visible={commentsVisible}
        post={selectedPost}
        onClose={() => setCommentsVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconBtn: {
    padding: 4,
    position: 'relative',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: COLORS.primary,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  feedHeaderRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingBottom: 20,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
});
