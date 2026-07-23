import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import { COLORS } from '../theme/colors';
import { setOnboardingCompleted, saveUserInterests } from '../services/onboardingService';

const { width, height } = Dimensions.get('window');

const INTEREST_TOPICS = [
  { id: 'poetry', name: 'Poetry 📜', icon: 'create' },
  { id: 'shayari', name: 'Shayari ✍️', icon: 'heart' },
  { id: 'quotes', name: 'Quotes 💭', icon: 'chatbubbles' },
  { id: 'stories', name: 'Stories 📖', icon: 'book' },
  { id: 'motivation', name: 'Motivation 🚀', icon: 'flame' },
  { id: 'love', name: 'Love ❤️', icon: 'rose' },
  { id: 'sadness', name: 'Sadness 🌧️', icon: 'rainy' },
  { id: 'philosophy', name: 'Philosophy 🧠', icon: 'bulb' },
  { id: 'technology', name: 'Technology 💻', icon: 'hardware-chip' },
  { id: 'humor', name: 'Humor 😂', icon: 'happy' },
  { id: 'nature', name: 'Nature 🌿', icon: 'leaf' },
];

const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Express Your Inner Voice ✨',
    subtitle: 'Share poetry, Shayari, and quotes on stunning custom background canvases designed to touch the soul.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    type: 'intro',
  },
  {
    id: '2',
    title: 'Connect & Inspire Writers 👥',
    subtitle: 'Build your audience, follow master poets, participate in daily challenges, and grow your literary presence.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    type: 'community',
  },
  {
    id: '3',
    title: 'Curate Your Interest Feed 🎯',
    subtitle: 'Select topics that inspire you. We will customize your daily quote stream around what you love.',
    type: 'interests',
  },
  {
    id: '4',
    title: 'Never Miss Soulful Writing 🔔',
    subtitle: 'Enable push notifications to receive daily quote challenges and stay alerted when writers react to your quotes.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    type: 'permissions',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState(['poetry', 'shayari', 'quotes', 'motivation']);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length === 1) {
        Alert.alert('Interest Selection', 'Please select at least 1 interest topic.');
        return;
      }
      setSelectedInterests(prev => prev.filter(item => item !== id));
    } else {
      setSelectedInterests(prev => [...prev, id]);
    }
  };

  const handleRequestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        Alert.alert('Notifications Enabled! 🔔', 'You will receive alerts for likes, comments, and daily challenges.');
      } else {
        Alert.alert('Permission Optional', 'You can enable notifications anytime from Settings.');
      }
    } catch (error) {
      setPermissionGranted(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleCompleteOnboarding();
    }
  };

  const handleCompleteOnboarding = async () => {
    await saveUserInterests('u1', selectedInterests);
    await setOnboardingCompleted();
    navigation.replace('Login');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const renderSlideItem = ({ item }) => {
    if (item.type === 'interests') {
      return (
        <View style={styles.slideContainer}>
          <View style={styles.slideHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>

          <ScrollView style={styles.interestsScroll} contentContainerStyle={styles.interestsGrid}>
            {INTEREST_TOPICS.map(topic => {
              const isSelected = selectedInterests.includes(topic.id);
              return (
                <TouchableOpacity
                  key={topic.id}
                  style={[styles.interestChip, isSelected && styles.interestChipSelected]}
                  onPress={() => toggleInterest(topic.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.interestText, isSelected && styles.interestTextSelected]}>
                    {topic.name}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    }

    if (item.type === 'permissions') {
      return (
        <View style={styles.slideContainer}>
          <View style={styles.imageCard}>
            <Image source={{ uri: item.image }} style={styles.illustrationImage} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.imageOverlay} />
          </View>

          <View style={styles.slideHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>

          <TouchableOpacity
            style={[styles.permissionBtn, permissionGranted && styles.permissionBtnGranted]}
            onPress={handleRequestNotificationPermission}
          >
            <Ionicons
              name={permissionGranted ? "checkmark-circle" : "notifications"}
              size={20}
              color={permissionGranted ? COLORS.primary : COLORS.accent}
            />
            <Text style={[styles.permissionBtnText, permissionGranted && { color: COLORS.primary }]}>
              {permissionGranted ? 'Notifications Enabled ✅' : 'Enable Push Notifications'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.slideContainer}>
        <View style={styles.imageCard}>
          <Image source={{ uri: item.image }} style={styles.illustrationImage} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)']} style={styles.imageOverlay} />
        </View>

        <View style={styles.slideHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar with Skip Button */}
      <View style={styles.topHeader}>
        <Text style={styles.brandName}>Mansoo</Text>
        <TouchableOpacity onPress={handleCompleteOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Onboarding Swipe FlatList */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={item => item.id}
        renderItem={renderSlideItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />

      {/* Bottom Footer Control Bar */}
      <View style={styles.bottomFooter}>
        {/* Progress Dots Indicator */}
        <View style={styles.dotsContainer}>
          {ONBOARDING_SLIDES.map((_, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <View
                key={idx}
                style={[styles.dot, isCurrent ? styles.activeDot : styles.inactiveDot]}
              />
            );
          })}
        </View>

        {/* Action Button (Next / Get Started) */}
        <TouchableOpacity style={styles.nextBtnContainer} onPress={handleNext} activeOpacity={0.85}>
          <LinearGradient
            colors={currentIndex === ONBOARDING_SLIDES.length - 1 ? COLORS.gradientGreen : COLORS.gradientPink}
            style={styles.nextBtn}
          >
            <Text style={styles.nextBtnText}>
              {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started 🚀' : 'Next'}
            </Text>
            <Ionicons
              name={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'rocket' : 'arrow-forward'}
              size={18}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: COLORS.primary,
  },
  skipText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  slideContainer: {
    width: width,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  imageCard: {
    width: width - 40,
    height: height * 0.38,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 10,
    position: 'relative',
    backgroundColor: '#0F3D3E',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  slideHeader: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  interestsScroll: {
    width: '100%',
    marginTop: 16,
    maxHeight: height * 0.45,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 5,
  },
  interestChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  interestText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  interestTextSelected: {
    color: '#FFFFFF',
  },
  permissionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F3',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 20,
  },
  permissionBtnGranted: {
    backgroundColor: '#E0F2F1',
    borderColor: COLORS.primary,
  },
  permissionBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: 10,
  },
  bottomFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#DDDDDD',
  },
  nextBtnContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
