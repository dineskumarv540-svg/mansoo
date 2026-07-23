import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { SPACING } from '../../theme/tokens';

export default function SettingsTile({
  icon,
  title,
  subtitle,
  onPress,
  isSwitch = false,
  switchValue,
  onSwitchChange,
  destructive = false,
  style,
}) {
  const { theme } = useAppTheme();

  const textColor = destructive ? theme.error : theme.textPrimary;
  const iconColor = destructive ? theme.error : theme.primary;

  const content = (
    <View style={[styles.tile, style]}>
      <View style={styles.leftRow}>
        {icon && <Ionicons name={icon} size={20} color={iconColor} style={{ marginRight: SPACING.md }} />}
        <View>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
        </View>
      </View>

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#DDDDDD', true: theme.primaryLight }}
          thumbColor={switchValue ? theme.primary : '#FFFFFF'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={16} color={destructive ? theme.error : theme.textMuted} />
      )}
    </View>
  );

  if (isSwitch) {
    return content;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
