import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { SPACING, RADIUS } from '../../theme/tokens';
import AppButton from './AppButton';

export default function AppDialog({
  visible,
  title,
  message,
  icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}) {
  const { theme } = useAppTheme();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
              {icon && (
                <View style={[styles.iconCircle, { backgroundColor: theme.surfaceLight }]}>
                  <Ionicons name={icon} size={32} color={destructive ? theme.error : theme.primary} />
                </View>
              )}

              <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
              {message ? <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text> : null}

              <View style={styles.buttonRow}>
                {cancelText ? (
                  <AppButton
                    title={cancelText}
                    variant="secondary"
                    onPress={onCancel}
                    style={{ flex: 1, marginRight: SPACING.xs }}
                  />
                ) : null}
                <AppButton
                  title={confirmText}
                  variant={destructive ? 'secondary' : 'primary'}
                  onPress={onConfirm}
                  style={[{ flex: 1, marginLeft: cancelText ? SPACING.xs : 0 }, destructive && { backgroundColor: theme.error }]}
                  textStyle={destructive ? { color: '#FFFFFF' } : null}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    width: '100%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
    marginBottom: SPACING.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
