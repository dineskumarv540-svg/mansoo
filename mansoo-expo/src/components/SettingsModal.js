import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  ScrollView,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useAppTheme } from '../theme/ThemeContext';

export default function SettingsModal({ visible, onClose, onLogout, onDeleteAccount, navigation, onOpenSupport }) {
  const { isDarkMode, toggleTheme } = useAppTheme();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings & Privacy</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Dark Mode */}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={COLORS.primary} style={styles.rowIcon} />
                    <Text style={styles.rowText}>Dark Mode</Text>
                  </View>
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#DDDDDD', true: COLORS.primaryLight }}
                    thumbColor={isDarkMode ? COLORS.primary : '#FFFFFF'}
                  />
                </View>

                {/* Notifications */}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="notifications-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                    <Text style={styles.rowText}>Push Notifications</Text>
                  </View>
                  <Switch
                    value={true}
                    onValueChange={() => {}}
                    trackColor={{ false: '#DDDDDD', true: COLORS.primaryLight }}
                    thumbColor={COLORS.primary}
                  />
                </View>

                {/* Reset Onboarding */}
                <TouchableOpacity
                  style={styles.row}
                  onPress={async () => {
                    const { resetOnboarding } = require('../services/onboardingService');
                    await resetOnboarding();
                    Alert.alert('Onboarding Reset 🚀', 'Tutorial will launch on next app start.');
                    onClose();
                  }}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons name="sparkles-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                    <Text style={styles.rowText}>Reset Onboarding Tutorial</Text>
                  </View>
                  <Ionicons name="reload" size={16} color={COLORS.primary} />
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* Legal Section Header */}
                <Text style={styles.sectionHeader}>Legal & Guidelines</Text>

                {/* Privacy Policy */}
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    onClose();
                    if (navigation) navigation.navigate('PrivacyPolicy');
                  }}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                    <Text style={styles.rowText}>Privacy Policy</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
                </TouchableOpacity>

                {/* Terms & Conditions */}
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    onClose();
                    if (navigation) navigation.navigate('TermsConditions');
                  }}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons name="document-text-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                    <Text style={styles.rowText}>Terms & Conditions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
                </TouchableOpacity>

                {/* Community Guidelines */}
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    onClose();
                    if (navigation) navigation.navigate('CommunityGuidelines');
                  }}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons name="people-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                    <Text style={styles.rowText}>Community Guidelines</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
                </TouchableOpacity>

                {/* Help Center & Support */}
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    onClose();
                    if (onOpenSupport) onOpenSupport();
                  }}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons name="help-buoy-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                    <Text style={styles.rowText}>Help Center & Support</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* Log Out */}
                <TouchableOpacity style={styles.row} onPress={() => { onClose(); onLogout(); }}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.textPrimary} style={styles.rowIcon} />
                    <Text style={styles.rowText}>Log Out</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
                </TouchableOpacity>

                {/* Delete Account */}
                <TouchableOpacity style={styles.row} onPress={() => { onClose(); onDeleteAccount(); }}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} style={styles.rowIcon} />
                    <Text style={[styles.rowText, { color: COLORS.error }]}>Delete Account</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.error} />
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.versionText}>Mansoo App v1.0.0 • Made with pride in India 🇮🇳</Text>
              </ScrollView>
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
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 30,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 12,
  },
  rowText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  versionText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});
