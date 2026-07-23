# 📱 Mansoo Android App - Setup & Build Documentation

**Mansoo** ("The Voice of Heart") is a full-featured Android social writing application built with **Kotlin + Jetpack Compose + MVVM Architecture**, backed by **Firebase Auth, Firestore, Storage**, and local offline caching.

---

## 🟢 1. Splash Screen Specifications

- **Background**: `#FFFFFF` (Clean Minimal White)
- **Center Logo**:
  - Circular badge in dark green (`#0F3D3E`) with white "M" branding
  - App Title: **Mansoo** (Playfair Display / Serif, Bold)
  - Tagline: *"The Voice of Heart"* (Italic, Small, `#0F3D3E`)
- **Bottom Section**:
  - Dark Green (`#0F3D3E`) Curved Header shape
  - Text: **"Made with pride in India 🇮🇳"** in white
- **Animation**:
  - 1.5 second smooth fade-in
  - 2.5 second total auto-redirect to Home Feed

---

## 📂 2. Complete Project Structure

```
d:/mansoo/
├── build.gradle.kts                       # Root Gradle plugin declarations
├── settings.gradle.kts                    # Dependency repositories & app module inclusion
├── index.html                             # Interactive Web Prototype with Splash Screen Preview
├── app/
│   ├── build.gradle.kts                   # Android dependencies (Compose BOM, Firebase, Coil, Navigation)
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml        # Application ID `com.mansoo.app` & MainActivity
│           └── java/com/mansoo/app/
│               ├── MainActivity.kt        # Main Entry Activity hosting Compose NavHost
│               ├── MansooApp.kt           # Application class initializing Firebase
│               │
│               ├── data/
│               │   ├── local/
│               │   │   └── SampleData.kt  # Seed posts, stories, categories & notifications
│               │   ├── model/
│               │   │   ├── Post.kt        # Quote post model with canvas background & likes/comments
│               │   │   ├── User.kt        # User profile, verified & premium badge metrics
│               │   │   ├── Comment.kt     # Inline comment data structure
│               │   │   ├── Category.kt    # Category section model (Nature, Love, Politics, etc.)
│               │   │   └── NotificationItem.kt # Activity feeds model
│               │   └── remote/
│               │       └── FirebaseRepository.kt # Firestore streams, Auth, Storage & like toggles
│               │
│               ├── ui/
│               │   ├── theme/
│               │   │   ├── Color.kt       # Soft gradient tokens, Primary Pink, Dark/Light modes
│               │   │   ├── Type.kt        # Serif, Monospace, Cursive quote typography
│               │   │   ├── Shape.kt
│               │   │   └── Theme.kt       # Mansoo Material 3 Theme wrapper
│               │   │
│               │   ├── components/
│               │   │   ├── StoryBar.kt    # Circular top story avatars with gradient borders
│               │   │   ├── PostCard.kt    # Quote image card with Mansoo watermark, likes, comments, save & 3-dot options
│               │   │   ├── PostOptionsMenu.kt # Bottom sheet menu (Report, Copy link, Notifications, etc.)
│               │   │   ├── UserSuggestionCard.kt # "People you may know" horizontal carousel
│               │   │   └── CategorySection.kt # Horizontal scrolling category cards
│               │   │
│               │   ├── screens/
│               │   │   ├── splash/
│               │   │   │   └── SplashScreen.kt # #0F3D3E Dark Green Logo, Playfair Display Mansoo, Curved Footer
│               │   │   ├── home/
│               │   │   │   └── HomeScreen.kt # Main Feed, Best Posts carousel, Stories & Suggestions
│               │   │   ├── explore/
│               │   │   │   └── ExploreScreen.kt # Search bar, Hashtags & Pinterest Staggered Grid
│               │   │   ├── categories/
│               │   │   │   └── CategoryScreen.kt # Category collections showcase
│               │   │   ├── create/
│               │   │   │   └── CreatePostScreen.kt # Quote Editor, Background selector & Image Exporter
│               │   │   ├── profile/
│               │   │   │   └── ProfileScreen.kt # Profile metrics, My Quotes & Saved tabs
│               │   │   └── notifications/
│               │   │       └── NotificationsScreen.kt # Likes, comments & follows list
│               │   │
│               │   ├── navigation/
│               │   │   └── MainNavigation.kt # Splash -> Home / Bottom Bar (Home, Search, Create +, Favorites, Profile)
│               │   │
│               │   └── viewmodel/
│               │       └── MainViewModel.kt # StateFlow management for feed, tags, search & creation
```

---

## ⚡ 3. Firebase Setup Steps

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a project named `MansooApp`.

2. **Register Android App**:
   - Package Name: `com.mansoo.app`.
   - Download `google-services.json` and save to `d:/mansoo/app/google-services.json`.

3. **Enable Firebase Authentication**:
   - Enable **Email/Password** and **Google Sign-In**.

4. **Setup Cloud Firestore Database**:
   - Create collections: `posts`, `users`, `comments`, `notifications`.

---

## 🛠️ 4. APK Build Guide

### Build via Terminal:

```bash
cd d:\mansoo
./gradlew assembleDebug
```
Output APK location:
`d:\mansoo\app\build\outputs\apk\debug\app-debug.apk`

---

## 🌐 5. Live Web Prototype Preview

Open `d:\mansoo\index.html` in any browser to interactively preview the **Splash Screen** with `#0F3D3E` Dark Green styling, 1.5s fade-in, 2.5s auto redirect, home feed, stories, options bottom sheet, explore masonry grid, and bottom navigation!
