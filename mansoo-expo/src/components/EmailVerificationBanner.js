import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function EmailVerificationBanner() {
  const { user, isEmailVerified, resendVerification } = useAuth();
  const [sent, setSent] = useState(false);

  if (!user || isEmailVerified) return null;

  const handleResend = async () => {
    const res = await resendVerification();
    if (res.success) {
      setSent(true);
      Alert.alert('Verification Sent', 'Please check your inbox to verify your email address.');
    } else {
      Alert.alert('Error', res.error);
    }
  };

  return (
    <View style={styles.banner}>
      <Ionicons name="mail-unread-outline" size={18} color="#D97706" style={styles.icon} />
      <Text style={styles.bannerText}>
        {sent ? 'Verification link sent!' : 'Your email is not verified.'}
      </Text>
      {!sent && (
        <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
          <Text style={styles.resendText}>Resend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  icon: {
    marginRight: 8,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  resendBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resendText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
