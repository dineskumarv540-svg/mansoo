import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { SPACING, RADIUS } from '../../theme/tokens';

export default function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  rightIcon,
  onRightIconPress,
  error,
  secureTextEntry,
  multiline,
  style,
  inputStyle,
  ...props
}) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        { backgroundColor: theme.surfaceLight, borderColor: error ? theme.error : theme.border },
        multiline && { alignItems: 'flex-start' }
      ]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={theme.primary}
            style={[styles.leftIcon, multiline && { marginTop: SPACING.xs }]}
          />
        )}

        <TextInput
          style={[
            styles.input,
            { color: theme.textPrimary },
            multiline && { minHeight: 80, textAlignVertical: 'top' },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          {...props}
        />

        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={20}
            color={theme.textSecondary}
            onPress={onRightIconPress}
            style={styles.rightIcon}
          />
        )}
      </View>

      {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 11,
    marginTop: SPACING.xs,
  },
});
