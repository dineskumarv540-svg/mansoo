import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const CATEGORY_GRADIENTS = {
  Nature: ['#11998E', '#38EF7D'],
  Love: ['#FF416C', '#FF4B2B'],
  Politics: ['#2C3E50', '#4CA1AF'],
  Humor: ['#F7971E', '#FFD200'],
  Jokes: ['#DA22FF', '#9733EE'],
  Sadness: ['#373B44', '#4286F4'],
};

export default function CategorySection({ category, onSeeAll }) {
  const gradient = CATEGORY_GRADIENTS[category.name] || COLORS.gradientGreen;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient colors={gradient} style={styles.accentBar} />
        <Text style={styles.emoji}>{category.emoji}</Text>
        <Text style={styles.categoryName}>{category.name}</Text>
        <TouchableOpacity style={styles.seeAllBtn} onPress={() => onSeeAll && onSeeAll(category)}>
          <Text style={[styles.seeAllText, { color: gradient[0] }]}>See All</Text>
          <Ionicons name="chevron-forward" size={14} color={gradient[0]} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {category.quotes.map((quote, idx) => {
          const isImageCard = idx % 2 === 0;
          return (
            <TouchableOpacity key={idx} style={styles.quoteCard} activeOpacity={0.85}>
              {isImageCard && category.coverImageUrl ? (
                <Image source={{ uri: category.coverImageUrl }} style={styles.bgImage} />
              ) : null}

              <LinearGradient
                colors={isImageCard ? ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)'] : gradient}
                style={styles.cardGradient}
              >
                <Text style={styles.quoteText} numberOfLines={4}>
                  "{quote}"
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 6,
    borderBottomColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  accentBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  emoji: {
    fontSize: 20,
    marginRight: 6,
  },
  categoryName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  quoteCard: {
    width: 180,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#222222',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardGradient: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});
