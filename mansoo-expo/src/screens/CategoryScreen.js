import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CategorySection from '../components/CategorySection';
import { CATEGORIES_DATA } from '../data/dummyData';
import { COLORS } from '../theme/colors';

export default function CategoryScreen() {
  const totalQuotes = CATEGORIES_DATA.reduce((sum, cat) => sum + cat.quotes.length, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <LinearGradient colors={COLORS.gradientGreen} style={styles.banner}>
          <Text style={styles.bannerTitle}>Explore Categories</Text>
          <Text style={styles.bannerSubtitle}>Dive deep into worlds of words ✨</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{CATEGORIES_DATA.length}</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalQuotes}+</Text>
              <Text style={styles.statLabel}>Quotes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5K+</Text>
              <Text style={styles.statLabel}>Writers</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Category Sections */}
        {CATEGORIES_DATA.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            onSeeAll={(cat) => Alert.alert('Category', `View all in ${cat.name}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  banner: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 10,
    borderRadius: 14,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
