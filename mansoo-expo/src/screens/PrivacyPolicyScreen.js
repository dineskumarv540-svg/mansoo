import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient colors={COLORS.gradientGreen} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Effective Date: July 24, 2026</Text>

        <Text style={styles.intro}>
          Welcome to Mansoo ("we", "our", or "us"). We value your trust and are committed to protecting your personal data and privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use the Mansoo application.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            • <Text style={styles.bold}>Account Information:</Text> When you register, we collect your email address, display name, profile photo, and password.
          </Text>
          <Text style={styles.paragraph}>
            • <Text style={styles.bold}>User Content:</Text> Posts, poems, quotes, comments, images, and messages you create and share on Mansoo.
          </Text>
          <Text style={styles.paragraph}>
            • <Text style={styles.bold}>Usage Data:</Text> Likes, bookmarks, shares, analytics, app interaction, device model, and OS version.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            • To personalize your feed, challenges, and writer profile experience.
          </Text>
          <Text style={styles.paragraph}>
            • To maintain community safety, enforce guidelines, and filter inappropriate content.
          </Text>
          <Text style={styles.paragraph}>
            • To process subscriptions (Mansoo Premium) securely via Google Play Billing.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Protection & Security</Text>
          <Text style={styles.paragraph}>
            We utilize Firebase Security Rules, Cloud Functions API validation, and encrypted local storage (SecureStore) to protect your sensitive authentication data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Your Rights & Account Deletion</Text>
          <Text style={styles.paragraph}>
            You have full control over your data. You may request account deletion at any time in App Settings. Upon deletion, your account credentials and personal content are permanently purged.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions regarding privacy, please contact privacy@mansoo.in.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  intro: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 13.5,
    color: COLORS.textPrimary,
    lineHeight: 21,
    marginBottom: 6,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
