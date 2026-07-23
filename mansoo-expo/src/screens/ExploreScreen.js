import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StaggeredGrid from '../components/StaggeredGrid';
import { DUMMY_POSTS, HASHTAGS } from '../data/dummyData';
import { COLORS } from '../theme/colors';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('#Story');

  const filteredPosts = DUMMY_POSTS.filter(post => {
    if (!searchQuery) return true;
    return post.quoteText.toLowerCase().includes(searchQuery.toLowerCase()) ||
           post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           post.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Rounded Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search quotes, poetry, authors..."
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. Horizontal Scrolling Hashtags */}
        <View style={styles.hashtagsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hashtagsScroll}
          >
            {HASHTAGS.map((tag) => {
              const isSelected = tag === selectedTag;
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.hashtagChip, isSelected && styles.hashtagChipSelected]}
                  onPress={() => setSelectedTag(tag)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.hashtagText, isSelected && styles.hashtagTextSelected]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section Label */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Trending</Text>
          <Text style={styles.itemCount}>{filteredPosts.length} posts</Text>
        </View>

        {/* 3. Pinterest-style Staggered Grid */}
        <StaggeredGrid
          posts={filteredPosts}
          onItemPress={(item) => Alert.alert('Explore Post', item.quoteText)}
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
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  hashtagsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  hashtagsScroll: {
    paddingHorizontal: 16,
  },
  hashtagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  hashtagChipSelected: {
    backgroundColor: COLORS.primary,
  },
  hashtagText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  hashtagTextSelected: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  itemCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
