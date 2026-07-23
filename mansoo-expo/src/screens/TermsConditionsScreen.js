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

export default function TermsConditionsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient colors={COLORS.gradientGreen} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Effective Date: July 24, 2026</Text>

        <Text style={styles.intro}>
          Please read these Terms & Conditions ("Terms") carefully before using the Mansoo mobile application operated by Mansoo Inc.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By creating an account or accessing Mansoo, you agree to be bound by these Terms and our Privacy Policy. If you disagree with any part, you may not access the service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. User Content & Copyright</Text>
          <Text style={styles.paragraph}>
            • You retain full ownership of all original poems, quotes, and literature posted on Mansoo.
          </Text>
          <Text style={styles.paragraph}>
            • You grant Mansoo a non-exclusive license to display, host, and distribute your content across the platform.
          </Text>
          <Text style={styles.paragraph}>
            • Plagiarism, unauthorized copying, or copyright infringement will result in content removal and potential account suspension.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Subscriptions & Billing</Text>
          <Text style={styles.paragraph}>
            Mansoo Premium subscriptions are billed through Google Play Store / Apple App Store. Subscriptions renew automatically unless canceled at least 24 hours before the period ends.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate accounts that violate our Community Guidelines or engage in fraudulent or abusive activities.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Contact</Text>
          <Text style={styles.paragraph}>
            For legal inquiries, email legal@mansoo.in.
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
});
