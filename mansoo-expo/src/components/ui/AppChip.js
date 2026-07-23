import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { SPACING, RADIUS } from '../../theme/tokens';

export default function AppChip({ label, icon, selected = false, onPress, style }) {
  const { theme } = useAppTheme();

  if (selected) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.wrapper, style]}>
        <LinearGradient colors={theme.gradientGreen} style={styles.chipSelected}>
          {icon && <Ionicons name={icon} size={14} color="#FFFFFF" style={{ marginRight: SPACING.xs }} />}
          <Text style={styles.textSelected}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, { backgroundColor: theme.surfaceLight, borderColor: theme.border }, style]}
    >
      {icon && <Ionicons name={icon} size={14} color={theme.textSecondary} style={{ marginRight: SPACING.xs }} />}
      <Text style={[styles.text, { color: theme.textPrimary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginRight: SPACING.xs,
  },
  chipSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  textSelected: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.xs,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});
