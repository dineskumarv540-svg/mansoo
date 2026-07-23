import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import {
  PREMIUM_PRODUCTS,
  purchasePremiumPlan,
  restorePurchases,
  isUserPro
} from '../services/billingService';
import { COLORS } from '../theme/colors';

const PRO_PERKS = [
  { icon: 'crown', title: 'Gold PRO Badge', desc: 'Display a golden verified PRO crown badge on your profile and quote cards.' },
  { icon: 'ban', title: '100% Ad-Free Experience', desc: 'Enjoy completely uninterrupted reading and writing without any ads.' },
  { icon: 'color-palette', title: 'Exclusive Themes & Fonts', desc: 'Access luxury studio background themes, Playfair & Script typography.' },
  { icon: 'bar-chart', title: 'Analytics+', desc: 'Unlock reader demographics, post interaction funnels, and daily traffic metrics.' },
  { icon: 'images', title: '4K Background Templates', desc: 'Unlimited access to 100+ high-definition Unsplash background templates.' },
  { icon: 'star', title: 'Custom Profile Styling', desc: 'Customize cover photos, gradient ring borders, and featured posts.' },
];

export default function PremiumScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(PREMIUM_PRODUCTS.YEARLY.id);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPro, setHasPro] = useState(isUserPro());

  const handleSubscribe = async () => {
    setPurchasing(true);
    const res = await purchasePremiumPlan(selectedPlan, 'u1');
    setPurchasing(false);
    setHasPro(true);
    Alert.alert('Mansoo PRO Activated 👑', res.message);
  };

  const handleRestore = async () => {
    setPurchasing(true);
    const res = await restorePurchases('u1');
    setPurchasing(false);
    setHasPro(true);
    Alert.alert('Purchases Restored 🔄', res.message);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mansoo PRO</Text>

        <TouchableOpacity onPress={handleRestore}>
          <Text style={styles.restoreHeaderBtn}>Restore</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 1. Golden Hero Crown Banner */}
        <LinearGradient colors={['#FFD54F', '#FFA000', '#E65100']} style={styles.heroCard}>
          <View style={styles.crownCircle}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>
          <Text style={styles.heroTitle}>MANSOO PRO</Text>
          <Text style={styles.heroSub}>Unlock the ultimate experience for soulful writers</Text>

          {hasPro && (
            <View style={styles.proActivePill}>
              <Text style={styles.proActivePillText}>PRO ACTIVE ✅</Text>
            </View>
          )}
        </LinearGradient>

        {/* 2. Perks Grid */}
        <Text style={styles.sectionTitle}>✨ Exclusive PRO Perks</Text>
        <View style={styles.perksList}>
          {PRO_PERKS.map((perk, idx) => (
            <View key={idx} style={styles.perkCard}>
              <View style={styles.perkIconBox}>
                <Ionicons name={perk.icon} size={20} color={COLORS.primary} />
              </View>
              <View style={styles.perkInfo}>
                <Text style={styles.perkTitle}>{perk.title}</Text>
                <Text style={styles.perkDesc}>{perk.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 3. Subscription Pricing Plan Selector */}
        <Text style={styles.sectionTitle}>💳 Select Your Plan</Text>

        {/* Yearly Plan (Recommended) */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === PREMIUM_PRODUCTS.YEARLY.id && styles.planCardSelected]}
          onPress={() => setSelectedPlan(PREMIUM_PRODUCTS.YEARLY.id)}
          activeOpacity={0.85}
        >
          <View style={styles.bestValueBadge}>
            <Text style={styles.bestValueText}>BEST VALUE • {PREMIUM_PRODUCTS.YEARLY.savingsTag}</Text>
          </View>

          <View style={styles.planHeader}>
            <View style={styles.radioCircle}>
              {selectedPlan === PREMIUM_PRODUCTS.YEARLY.id && <View style={styles.radioInner} />}
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{PREMIUM_PRODUCTS.YEARLY.name}</Text>
              <Text style={styles.planSub}>{PREMIUM_PRODUCTS.YEARLY.monthlyEquivalent}</Text>
            </View>
            <Text style={styles.planPrice}>{PREMIUM_PRODUCTS.YEARLY.priceText}</Text>
          </View>
        </TouchableOpacity>

        {/* Monthly Plan */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === PREMIUM_PRODUCTS.MONTHLY.id && styles.planCardSelected]}
          onPress={() => setSelectedPlan(PREMIUM_PRODUCTS.MONTHLY.id)}
          activeOpacity={0.85}
        >
          <View style={styles.planHeader}>
            <View style={styles.radioCircle}>
              {selectedPlan === PREMIUM_PRODUCTS.MONTHLY.id && <View style={styles.radioInner} />}
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{PREMIUM_PRODUCTS.MONTHLY.name}</Text>
              <Text style={styles.planSub}>Flexible monthly billing</Text>
            </View>
            <Text style={styles.planPrice}>{PREMIUM_PRODUCTS.MONTHLY.priceText}</Text>
          </View>
        </TouchableOpacity>

        {/* 4. Action Buttons */}
        <TouchableOpacity style={styles.subscribeBtnContainer} onPress={handleSubscribe} disabled={purchasing}>
          <LinearGradient colors={['#FFD54F', '#FFA000', '#E65100']} style={styles.subscribeBtn}>
            {purchasing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="bag-check" size={18} color="#FFFFFF" />
                <Text style={styles.subscribeBtnText}>
                  {hasPro ? 'Manage Subscription 👑' : 'Subscribe via Google Play 🚀'}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRestore} style={styles.restoreFooterBtn}>
          <Text style={styles.restoreFooterText}>Restore Existing Google Play Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimerText}>
          Payment will be charged to your Google Play Account at confirmation of purchase. Subscription automatically renews unless cancelled 24 hours before period end.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'serif',
  },
  restoreHeaderBtn: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scrollContent: {
    padding: 16,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  crownCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  crownEmoji: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  heroSub: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 4,
  },
  proActivePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 12,
  },
  proActivePillText: {
    color: '#E65100',
    fontWeight: 'bold',
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  perksList: {
    marginBottom: 16,
  },
  perkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  perkIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  perkInfo: {
    flex: 1,
  },
  perkTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  perkDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#FFA000',
    backgroundColor: '#FFFDE7',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#E65100',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bestValueText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFA000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFA000',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  planSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subscribeBtnContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 12,
  },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  restoreFooterBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 12,
  },
  restoreFooterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  disclaimerText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 20,
  },
});
