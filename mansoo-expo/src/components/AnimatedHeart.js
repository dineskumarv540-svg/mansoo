import React, { useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function AnimatedHeart({ isLiked, onToggle, size = 24 }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    onToggle();
    // Scale bounce sequence: Grow → Overshoot → Settle
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.35,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1.0,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={{ padding: 4 }}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={size}
          color={isLiked ? COLORS.likeRed : COLORS.textPrimary}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
