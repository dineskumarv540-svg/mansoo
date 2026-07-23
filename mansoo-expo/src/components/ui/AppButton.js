import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { SPACING, RADIUS } from '../../theme/tokens';

/**
 * Reusable Design System Button Component
 * @param {'primary'|'secondary'|'outline'|'ghost'|'pro'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) {
  const { theme } = useAppTheme();

  const isGradient = variant === 'primary' || variant === 'pro';

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md };
      case 'lg': return { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl };
      default: return { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 12;
      case 'lg': return 16;
      default: return 14;
    }
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? theme.primary : '#FFFFFF'} size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={getFontSize() + 2} color={variant === 'outline' || variant === 'ghost' ? theme.primary : '#FFFFFF'} style={{ marginRight: SPACING.xs }} />}
          <Text style={[styles.text, { fontSize: getFontSize(), color: variant === 'outline' || variant === 'ghost' ? theme.primary : '#FFFFFF' }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (isGradient && !disabled) {
    const gradientColors = variant === 'pro' ? [theme.proGold, '#FF8F00'] : theme.gradientGreen;
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={disabled || loading} style={[styles.btnWrapper, style]}>
        <LinearGradient colors={gradientColors} style={[styles.baseBtn, getPadding(), disabled && styles.disabled]}>
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getExtraStyle = () => {
    if (variant === 'secondary') return { backgroundColor: theme.surfaceLight };
    if (variant === 'outline') return { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.primary };
    if (variant === 'ghost') return { backgroundColor: 'transparent' };
    return { backgroundColor: theme.primary };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[styles.baseBtn, getPadding(), getExtraStyle(), disabled && styles.disabled, style]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnWrapper: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  baseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  text: {
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});
