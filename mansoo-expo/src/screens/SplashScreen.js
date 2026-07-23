import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoAlpha = useRef(new Animated.Value(0)).current;
  const titleAlpha = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;
  const bottomAlpha = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered Animation Sequence
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1.0,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoAlpha, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleAlpha, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(bottomAlpha, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Center Logo & Branding */}
      <View style={styles.centerContainer}>
        <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoAlpha }}>
          <LinearGradient
            colors={COLORS.gradientGreen}
            style={styles.logoCircle}
          >
            <Text style={styles.logoLetter}>M</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={{
            opacity: titleAlpha,
            transform: [{ translateY: titleSlide }],
            alignItems: 'center',
          }}
        >
          <Text style={styles.appName}>Mansoo</Text>
          <Text style={styles.tagline}>The Voice of Heart</Text>
        </Animated.View>
      </View>

      {/* Bottom Curved Wave */}
      <Animated.View style={[styles.bottomCurvedContainer, { opacity: bottomAlpha }]}>
        <LinearGradient colors={COLORS.gradientGreen} style={styles.curvedBanner}>
          <Text style={styles.prideText}>Made with pride in India 🇮🇳</Text>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'serif',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  bottomCurvedContainer: {
    width: '100%',
    height: 90,
  },
  curvedBanner: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prideText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
