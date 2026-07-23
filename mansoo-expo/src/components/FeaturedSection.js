import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function FeaturedSection({ featuredPosts = [], onPostPress }) {
  if (!featuredPosts || featuredPosts.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.sparkle}>💖</Text>
        <Text style={styles.title}>Our Best Posts</Text>
        <Text style={styles.sparkle}>💖</Text>
      </View>
      <Text style={styles.subtitle}>Hand-picked by the Mansoo team ✨</Text>

      {/* Featured Cards Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {featuredPosts.map((post, index) => {
          const isHero = index === 0;
          return (
            <TouchableOpacity
              key={post.id}
              style={[styles.card, isHero ? styles.heroCard : styles.normalCard]}
              onPress={() => onPostPress && onPostPress(post)}
              activeOpacity={0.9}
            >
              {/* Background Image */}
              <Image source={{ uri: post.backgroundImageUrl }} style={styles.cardImage} />

              {/* Gradient Overlay */}
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
                style={styles.gradientOverlay}
              >
                {/* Badge */}
                <View style={[styles.badge, isHero ? styles.heroBadge : styles.normalBadge]}>
                  <Ionicons name="star" size={10} color="#FFFFFF" />
                  <Text style={styles.badgeText}>
                    {isHero ? "Editor's Pick" : "Featured"}
                  </Text>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <Text style={styles.quoteText} numberOfLines={3}>
                    "{post.quoteText}"
                  </Text>
                  <View style={styles.authorRow}>
                    <Image source={{ uri: post.authorAvatarUrl }} style={styles.authorAvatar} />
                    <Text style={styles.authorName} numberOfLines={1}>{post.authorName}</Text>
                    <Ionicons name="heart" size={12} color="#FF6B8A" style={{ marginLeft: 6 }} />
                    <Text style={styles.likesText}>{post.likesCount}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Dots Indicator */}
      <View style={styles.dotsRow}>
        {featuredPosts.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === 0 ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    fontSize: 16,
    marginHorizontal: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B5004C',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: '#222222',
  },
  heroCard: {
    width: 290,
    height: 180,
  },
  normalCard: {
    width: 230,
    height: 160,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroBadge: {
    backgroundColor: COLORS.accent,
  },
  normalBadge: {
    backgroundColor: 'rgba(242, 107, 138, 0.85)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cardContent: {
    justifyContent: 'flex-end',
  },
  quoteText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  authorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  authorName: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    marginLeft: 6,
    flex: 1,
  },
  likesText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 18,
    backgroundColor: COLORS.accent,
  },
  inactiveDot: {
    width: 5,
    backgroundColor: '#DDDDDD',
  },
});
