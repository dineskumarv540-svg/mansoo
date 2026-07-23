import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export function SkeletonItem({ width, height, borderRadius = 8, style }) {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeletonBase,
        { width, height, borderRadius, opacity: opacityAnim },
        style,
      ]}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      {/* Header */}
      <View style={styles.headerRow}>
        <SkeletonItem width={40} height={40} borderRadius={20} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <SkeletonItem width={120} height={14} borderRadius={4} />
          <SkeletonItem width={80} height={10} borderRadius={4} style={{ marginTop: 6 }} />
        </View>
      </View>

      {/* Main Canvas */}
      <SkeletonItem width="100%" height={220} borderRadius={12} style={{ marginVertical: 12 }} />

      {/* Action Row */}
      <View style={styles.actionRow}>
        <SkeletonItem width={24} height={24} borderRadius={12} />
        <SkeletonItem width={24} height={24} borderRadius={12} style={{ marginLeft: 12 }} />
        <SkeletonItem width={24} height={24} borderRadius={12} style={{ marginLeft: 12 }} />
      </View>
    </View>
  );
}

export function StoryBarSkeleton() {
  return (
    <View style={styles.storyRow}>
      {[1, 2, 3, 4, 5].map((key) => (
        <View key={key} style={styles.storyItem}>
          <SkeletonItem width={60} height={60} borderRadius={30} />
          <SkeletonItem width={45} height={10} borderRadius={4} style={{ marginTop: 6 }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: '#E5E7EB',
  },
  cardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
});
