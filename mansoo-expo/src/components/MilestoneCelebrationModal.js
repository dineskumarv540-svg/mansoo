import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

/**
 * Animated Celebration Popup Modal with XP burst & level up graphics
 */
export default function MilestoneCelebrationModal({ visible, rewardData, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const alphaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(alphaAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      alphaAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: alphaAnim }]}>
              {/* Confetti Particles */}
              <View style={styles.confettiContainer}>
                {['✨', '🎉', '🌟', '👑', '🔥', '📜'].map((symbol, idx) => (
                  <Text key={idx} style={[styles.particle, { left: idx * 45 + 10 }]}>{symbol}</Text>
                ))}
              </View>

              {/* Icon Burst */}
              <LinearGradient colors={COLORS.gradientPink} style={styles.iconCircle}>
                <Ionicons
                  name={rewardData?.leveledUp ? "trophy" : "gift"}
                  size={42}
                  color="#FFFFFF"
                />
              </LinearGradient>

              {/* Title & Message */}
              <Text style={styles.title}>
                {rewardData?.leveledUp ? '🎉 LEVEL UP ACHIEVED!' : '✨ CHALLENGE COMPLETED!'}
              </Text>

              <Text style={styles.xpText}>+{rewardData?.rewardXp || 50} XP EARNED</Text>

              <Text style={styles.subText}>
                {rewardData?.leveledUp
                  ? `Congratulations! You have reached ${rewardData.levelTitle} (Level ${rewardData.level})!`
                  : `Great job! Your XP has increased to ${rewardData?.totalXp || 2900} XP.`
                }
              </Text>

              {/* Action Button */}
              <TouchableOpacity style={styles.claimBtnContainer} onPress={onClose} activeOpacity={0.85}>
                <LinearGradient colors={COLORS.gradientGreen} style={styles.claimBtn}>
                  <Text style={styles.claimBtnText}>Claim & Continue 🚀</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width - 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  confettiContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  particle: {
    fontSize: 20,
    opacity: 0.85,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  xpText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 10,
  },
  subText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  claimBtnContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  claimBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
