import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { SPACING, RADIUS, SHADOWS } from '../../theme/tokens';

export default function AppToast({ visible, message, type = 'info', onDismiss }) {
  const { theme } = useAppTheme();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          if (onDismiss) onDismiss();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'warning';
      default: return 'information-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return theme.success;
      case 'error': return theme.error;
      case 'warning': return theme.warning;
      default: return theme.primary;
    }
  };

  return (
    <Animated.View style={[styles.container, SHADOWS.md, { opacity, backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <Ionicons name={getIcon()} size={22} color={getColor()} style={{ marginRight: SPACING.sm }} />
      <Text style={[styles.message, { color: theme.textPrimary }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    zIndex: 9999,
  },
  message: {
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
  },
});
