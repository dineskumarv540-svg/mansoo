import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function DailyChallengeCard({ challenge, onWritePress }) {
  if (!challenge) return null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F3D3E', '#1A5F60']} style={styles.cardGradient}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Ionicons name="trophy" size={12} color="#FFD700" />
            <Text style={styles.badgeText}>{challenge.title}</Text>
          </View>
          <View style={styles.timerTag}>
            <Ionicons name="time-outline" size={12} color="#FFFFFF" />
            <Text style={styles.timerText}>{challenge.hoursLeft}h left</Text>
          </View>
        </View>

        <Text style={styles.promptText}>"{challenge.prompt}"</Text>

        <View style={styles.footerRow}>
          <Text style={styles.tagText}>{challenge.tag}</Text>
          <TouchableOpacity style={styles.writeBtn} onPress={onWritePress} activeOpacity={0.85}>
            <Ionicons name="pencil" size={14} color={COLORS.primary} />
            <Text style={styles.writeBtnText}>Write Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cardGradient: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  badgeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timerTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginLeft: 4,
  },
  promptText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: 'bold',
  },
  writeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  writeBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
