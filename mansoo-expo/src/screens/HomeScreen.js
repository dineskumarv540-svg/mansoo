import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StoryBar from '../components/StoryBar';
import FeaturedSection from '../components/FeaturedSection';
import UserSuggestions from '../components/UserSuggestions';
import PostCard from '../components/PostCard';
import PostOptionsSheet from '../components/PostOptionsSheet';
import { DUMMY_POSTS, DUMMY_STORIES, DUMMY_USERS } from '../data/dummyData';
import { COLORS } from '../theme/colors';

import DailyChallengeCard from '../components/DailyChallengeCard';
import AdBanner from '../components/AdBanner';
import { getTodayChallenge } from '../services/challengeService';

export default function HomeScreen({ navigation }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const featuredPosts = DUMMY_POSTS.filter(p => p.isFeatured);
  const todayChallenge = getTodayChallenge();

  const handleOptionsPress = (post) => {
    setSelectedPost(post);
    setSheetVisible(true);
  };

  const handleOptionSelect = (action) => {
    Alert.alert('Action Selected', action);
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
        featuredPosts={featuredPosts}
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

      {/* Main Scrollable Feed */}
      <FlatList
        data={DUMMY_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onOptionsPress={handleOptionsPress}
            onCommentPress={(p) => Alert.alert('Comments', `View comments for ${p.id}`)}
            onSharePress={(p) => Alert.alert('Share', `Share post ${p.id}`)}
          />
        )}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
});
