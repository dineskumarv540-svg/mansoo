import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { SPACING } from '../../theme/tokens';
import AppButton from './AppButton';

export default function AppEmptyState({
  icon = 'newspaper-outline',
  title = 'No items found',
  message = 'There is no content available right now.',
  buttonTitle,
  onButtonPress,
  style,
}) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.surfaceLight }]}>
        <Ionicons name={icon} size={48} color={theme.textMuted} />
      </View>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

      {buttonTitle && onButtonPress ? (
        <AppButton title={buttonTitle} onPress={onButtonPress} style={{ marginTop: SPACING.lg }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  message: {
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 20,
  },
});
