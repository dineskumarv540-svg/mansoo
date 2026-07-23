import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';

export default function AppAvatar({
  uri,
  size = 'md', // 'sm' (32), 'md' (48), 'lg' (64), 'xl' (96)
  isPro = false,
  isVerified = false,
  style,
}) {
  const { theme } = useAppTheme();

  const getDimension = () => {
    switch (size) {
      case 'sm': return 32;
      case 'lg': return 64;
      case 'xl': return 96;
      default: return 48;
    }
  };

  const dim = getDimension();
  const radius = dim / 2;

  const defaultUri = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400';

  return (
    <View style={[{ width: dim, height: dim }, style]}>
      {isPro ? (
        <LinearGradient colors={theme.gradientStory} style={[styles.gradientBorder, { width: dim, height: dim, borderRadius: radius }]}>
          <Image source={{ uri: uri || defaultUri }} style={[styles.avatar, { width: dim - 4, height: dim - 4, borderRadius: (dim - 4) / 2 }]} />
        </LinearGradient>
      ) : (
        <Image source={{ uri: uri || defaultUri }} style={[styles.avatar, { width: dim, height: dim, borderRadius: radius }]} />
      )}

      {isVerified && (
        <View style={[styles.badgeContainer, { bottom: 0, right: 0 }]}>
          <Ionicons name="checkmark-circle" size={dim * 0.3} color={theme.verified} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#DDDDDD',
  },
  badgeContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 99,
  },
});
