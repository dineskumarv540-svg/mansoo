# Mansoo Engineering Developer Guide

Welcome to the **Mansoo** codebase! This document outlines engineering standards, project layout, state management, design tokens, and Git workflow.

---

## 📁 Directory Structure Overview

```
d:/mansoo/mansoo-expo/
├── assets/                  # Icons, splash screen images & static assets
├── functions/               # Firebase Cloud Functions (Node.js 20, Zod, Bad-Words)
├── firestore.rules          # Production Security Rules for Cloud Firestore
├── storage.rules            # Production Security Rules for Firebase Storage
├── app.json                 # Expo configuration & app manifest
├── eas.json                 # Expo Application Services build profile configuration
└── src/
    ├── components/          # Specialized feature components (PostCard, StoryBar, etc.)
    │   └── ui/              # Atomic Design System UI components (AppButton, AppInput, etc.)
    ├── context/             # AuthContext, LanguageContext, ThemeContext
    ├── data/                # Initial fallback datasets
    ├── hooks/               # Custom hooks (useRateLimiter, useTheme)
    ├── i18n/                # Translations for English, Hindi, Hinglish, Urdu, Russian
    ├── navigation/          # React Navigation stacks & bottom tabs
    ├── screens/             # 14 Full Application Screens
    ├── services/            # Firebase DB, Cloud Functions, Share, Analytics, Moderation
    ├── theme/               # Tokens (colors, spacing grid, radius, typography scale, shadows)
    └── utils/               # SecureStorage wrapper, validation helpers
```

---

## 🎨 Design System Guidelines

1. **Zero Hardcoded Colors**: Always consume `theme` colors from `useAppTheme()`.
2. **4px Grid System**: Use `SPACING` tokens (`xs: 4`, `sm: 8`, `md: 12`, `lg: 16`, `xl: 20`, `xxl: 24`, `xxxl: 32`).
3. **Typography Tokens**: Apply `TYPOGRAPHY_SCALE` for consistent header and body sizing.
4. **Reusability**: Always prefer `AppButton`, `AppInput`, `AppAvatar`, `AppChip`, and `AppBadge` over inline custom elements.

---

## 🌿 Git Branching & Workflow

- `main` / `master`: Production-ready code.
- `feature/*`: New features (e.g. `feature/gamification-challenges`).
- `fix/*`: Bug fixes and security patches.
- **Commit Messages**: Conventional commits (`feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`).

---

## 🧪 Testing & Code Quality

- **Linting**: Execute `npm run lint` before committing.
- **Security Check**: Verify no hardcoded production credentials exist in source code.
