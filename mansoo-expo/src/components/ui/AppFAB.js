import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { RADIUS, SHADOWS } from '../../theme/tokens';

export default function AppFAB({ icon = 'add', onPress, style }) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.fabContainer, SHADOWS.lg, style]}>
      <LinearGradient colors={theme.gradientGreen} style={styles.fab}>
        <Ionicons name={icon} size={26} color="#FFFFFF" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: RADIUS.full,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
