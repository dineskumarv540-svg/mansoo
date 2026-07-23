import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TabNavigator from './TabNavigator';
import NotificationsScreen from '../screens/NotificationsScreen';
import DraftsScreen from '../screens/DraftsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import GamificationScreen from '../screens/GamificationScreen';
import PremiumScreen from '../screens/PremiumScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import CommunityGuidelinesScreen from '../screens/CommunityGuidelinesScreen';
import WritingRoomsScreen from '../screens/WritingRoomsScreen';
import WritingRoomDetailScreen from '../screens/WritingRoomDetailScreen';
import { AuthProvider } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Drafts" component={DraftsScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen name="Gamification" component={GamificationScreen} />
          <Stack.Screen name="Premium" component={PremiumScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
          <Stack.Screen name="CommunityGuidelines" component={CommunityGuidelinesScreen} />
          <Stack.Screen name="WritingRooms" component={WritingRoomsScreen} />
          <Stack.Screen name="WritingRoomDetail" component={WritingRoomDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
