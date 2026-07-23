import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { SPACING, RADIUS } from '../../theme/tokens';

export default function AppBadge({ label, variant = 'primary', count, style }) {
  const { theme } = useAppTheme();

  const getBgColor = () => {
    switch (variant) {
      case 'pro': return theme.proGold;
      case 'verified': return theme.verified;
      case 'error': return theme.error;
      case 'success': return theme.success;
      case 'secondary': return theme.surfaceLight;
      default: return theme.primary;
    }
  };

  const textVal = count !== undefined ? (count > 99 ? '99+' : count.toString()) : label;

  return (
    <View style={[styles.badge, { backgroundColor: getBgColor() }, style]}>
      <Text style={[styles.text, { color: variant === 'secondary' ? theme.textPrimary : '#FFFFFF' }]}>
        {textVal}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
