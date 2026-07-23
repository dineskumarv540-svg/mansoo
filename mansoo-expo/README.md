# 📖 Mansoo — The Voice of Heart (React Native Expo Application)

[![Expo](https://img.shields.io/badge/Expo-v51.0.0-000000.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.74.1-61DAFB.svg)](https://reactnative.dev)
[![Firebase](https://img.shields.io/badge/Firebase-v10.8.0-FFCA28.svg)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-Proprietary-0F3D3E.svg)]()

**Mansoo** is a premium social mobile platform designed for poets, writers, quote creators, and literature enthusiasts. It features a full-featured writing canvas, gamified writing streaks, analytics dashboard, professional image sharing, multilingual support (English, Hindi, Hinglish, Urdu, Russian), and enterprise-grade security.

---

## ✨ Key Features

- 📜 **Rich Writer Canvas**: Custom typography, background images, linear gradients, and real-time canvas preview.
- 📊 **Analytics Dashboard+**: Real-time reader engagement metrics, daily/weekly visitor charts, best performing posts, and reading time breakdown.
- 🏆 **Gamification Engine**: Daily/Weekly writing challenges, XP points, writer levels, streak counters, badges, and top writers leaderboard.
- 👑 **Mansoo Premium**: Ad-free experience, Gold PRO badge, exclusive fonts, themes, and background templates integrated with Google Play Billing.
- 🎨 **Unified Design System**: Dynamic Light/Dark mode, 4px grid spacing, reusable atomic component library (`AppButton`, `AppInput`, `AppAvatar`, `AppChip`, `AppBadge`).
- 🌐 **Multilingual & RTL**: Seamless language switching across 5 languages with native RTL support for Urdu.
- 🛡️ **Enterprise Security**: Firestore security rules, Firebase Storage rules, Cloud Functions API validation (`zod`), profanity filtering (`bad-words`), rate-limiting, abuse reporting, and `expo-secure-store`.
- 📲 **Professional Social Sharing**: Export HD styled quotes as stories, images, social deep links, and profile/post QR codes.

---

## 🛠️ Technology Stack

- **Framework**: React Native (Expo SDK 51)
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State & Theme**: React Context API + Custom Dynamic Theme Tokens (`tokens.js`)
- **Backend & Database**: Firebase Auth, Firestore, Storage, Cloud Functions
- **Encryption & Security**: `expo-secure-store`
- **UI & Animations**: `expo-linear-gradient`, `@expo/vector-icons`, `react-native-reanimated`

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18+ installed
- Expo Go app on device or Android/iOS Emulator

### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/dineskumarv540-svg/mansoo.git
cd mansoo/mansoo-expo

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npm start
```

---

## 📱 Release Build Commands

```bash
# Build Android Standalone APK (Preview)
eas build -p android --profile preview

# Build Android Play Store App Bundle (AAB)
eas build -p android --profile production
```

---

## 📄 License & Contact

Copyright © 2026 Mansoo Inc. All rights reserved.
For inquiries, reach out to `support@mansoo.in`.
