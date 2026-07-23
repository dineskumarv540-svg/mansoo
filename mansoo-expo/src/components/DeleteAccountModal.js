import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function DeleteAccountModal({ visible, onClose }) {
  const { deleteAccount, logout } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!visible) return null;

  const handleDelete = async () => {
    if (confirmText.trim().toLowerCase() !== 'delete') {
      Alert.alert('Confirmation Failed', 'Please type "DELETE" to confirm account deletion.');
      return;
    }

    Alert.alert(
      'Permanent Action',
      'Are you absolutely sure? All your posts, followers, and badges will be permanently erased.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            const res = await deleteAccount();
            setIsDeleting(false);
            if (res.success) {
              Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
              onClose();
              logout();
            } else {
              Alert.alert('Deletion Error', res.error || 'Failed to delete account. You may need to log in again.');
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Ionicons name="trash-bin-outline" size={32} color={COLORS.likeRed} />
              </View>

              <Text style={styles.title}>Delete Account?</Text>
              <Text style={styles.subtitle}>
                This action is permanent and cannot be undone. All your posts, drafts, and achievements will be erased.
              </Text>

              <Text style={styles.label}>Type <Text style={styles.boldText}>DELETE</Text> to confirm:</Text>
              <TextInput
                style={styles.input}
                placeholder="DELETE"
                placeholderTextColor="#AAAAAA"
                value={confirmText}
                onChangeText={setConfirmText}
                autoCapitalize="characters"
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isDeleting}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteBtn, confirmText.trim().toLowerCase() !== 'delete' && styles.disabledBtn]}
                  onPress={handleDelete}
                  disabled={confirmText.trim().toLowerCase() !== 'delete' || isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.deleteBtnText}>Delete Permanently</Text>
                  )}
                </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: COLORS.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.likeRed,
  },
  input: {
    width: '100%',
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  deleteBtn: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.likeRed,
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
