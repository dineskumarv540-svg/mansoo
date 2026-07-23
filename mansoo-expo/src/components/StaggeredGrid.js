import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function StaggeredGrid({ posts = [], onItemPress }) {
  // Split into left and right columns
  const leftColumn = posts.filter((_, idx) => idx % 2 === 0);
  const rightColumn = posts.filter((_, idx) => idx % 2 !== 0);

  const renderCard = (item, isTall) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.gridCard, { height: isTall ? 220 : 160 }]}
      onPress={() => onItemPress && onItemPress(item)}
      activeOpacity={0.88}
    >
      {item.backgroundImageUrl ? (
        <Image source={{ uri: item.backgroundImageUrl }} style={styles.cardImage} />
      ) : null}

      <LinearGradient
        colors={item.backgroundImageUrl ? ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)'] : COLORS.gradientGreen}
        style={styles.cardOverlay}
      >
        <Text style={styles.quoteText} numberOfLines={4}>
          "{item.quoteText}"
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.authorName} numberOfLines={1}>{item.authorName}</Text>
          <View style={styles.likeBadge}>
            <Ionicons name="heart" size={10} color="#FF6B8A" />
            <Text style={styles.likeCount}>{item.likesCount}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.gridContainer}>
      <View style={styles.column}>
        {leftColumn.map((item, idx) => renderCard(item, idx % 2 === 0))}
      </View>
      <View style={styles.column}>
        {rightColumn.map((item, idx) => renderCard(item, idx % 2 !== 0))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  gridCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#222222',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardOverlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  quoteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  authorName: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
  },
  likeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  likeCount: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 3,
  },
});
