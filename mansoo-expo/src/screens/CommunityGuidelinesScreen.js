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

export default function CommunityGuidelinesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient colors={COLORS.gradientGreen} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Guidelines</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Mansoo is a sanctuary for writers, poets, and creative thinkers. We are committed to maintaining a respectful, encouraging, and safe platform for everyone.
        </Text>

        <View style={styles.card}>
          <Ionicons name="heart-outline" size={28} color={COLORS.accent} style={styles.icon} />
          <Text style={styles.cardTitle}>1. Be Respectful & Kind</Text>
          <Text style={styles.cardDesc}>
            Constructive critique is welcomed, but personal attacks, harassment, bullying, or hate speech will not be tolerated under any circumstances.
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="shield-checkmark-outline" size={28} color={COLORS.primaryLight} style={styles.icon} />
          <Text style={styles.cardTitle}>2. Respect Originality</Text>
          <Text style={styles.cardDesc}>
            Always post your original work or properly attribute quotes to their original authors. Plagiarism is strictly prohibited.
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="eye-off-outline" size={28} color={COLORS.proGold} style={styles.icon} />
          <Text style={styles.cardTitle}>3. Moderate Content</Text>
          <Text style={styles.cardDesc}>
            Do not upload explicit, violent, sexually suggestive, or harmful material. Mansoo employs automated filters and active moderators.
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="flag-outline" size={28} color={COLORS.likeRed} style={styles.icon} />
          <Text style={styles.cardTitle}>4. Report Violations</Text>
          <Text style={styles.cardDesc}>
            If you encounter content that violates these guidelines, use the "Report" option in the post options menu. Reports are reviewed within 24 hours.
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
  intro: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  icon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
