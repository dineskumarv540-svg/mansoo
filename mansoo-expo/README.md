# Mansoo — React Native (Expo) Social Writing Mobile App

> **Tagline:** "The Voice of Heart" 📖✨

A full-featured, production-ready social writing mobile application built with **React Native (Expo)**, **React Navigation**, and **Firebase**. Inspired by modern apps like Instagram and YourQuote.

---

## 📱 Features & Highlights

### 1. 🔷 Splash Screen
- White background with center circular branding logo (`M` style)
- Smooth staggered animation sequence (Logo scale pop → App Title slide up → Tagline fade)
- Bottom curved brand wave: *"Made with pride in India 🇮🇳"*
- Automatic navigation to Login screen after 2.5 seconds

### 2. 🔷 Navigation Architecture
- **Root Stack Navigator** (`AppNavigator.js`): `Splash → Login → MainTabs → Notifications`
- **Bottom 5-Tab Navigation** (`TabNavigator.js`):
  1. 🏠 **Home** (Feed, Stories, Featured, User Suggestions)
  2. 🔍 **Explore** (Search, Hashtags, 2-column Pinterest grid)
  3. ➕ **Create** (Center highlighted 56dp gradient FAB)
  4. ❤️ **Favorites** (5 horizontal category sections)
  5. 👤 **Profile** (Cover header, stats, 3-tab grid)

### 3. 🔷 Feed & Home Screen
- **Stories Bar**: Horizontal scroll with animated gradient rings for unviewed/verified user stories + `+ Add Story` item.
- **Featured Section**: *"💖 Our Best Posts 💖"* with hero card (`290×180dp`), gradient overlay, badge, and indicator dots.
- **User Suggestions**: *"People You May Know"* carousel with follow buttons and PRO badges.
- **Post Cards**: Header with avatar, handle, verified badge, live quote canvas, animated heart like button (`❤️ 💬 🔗 🔖`), likes count, and comment preview.

### 4. 🔷 Explore & Search Screen
- Rounded search bar with live text query filter.
- Horizontal hashtag chips (`#Story #Poem #Quotes #Trending #Novel #Life #Culture #Unique #Feelings #Meme`).
- Pinterest-style **2-column staggered grid** with alternating card heights and dark gradient overlays.

### 5. 🔷 Category Screen
- Dark-green gradient header banner with category, quote, and writer counter stats.
- 5 rich category sections (`Nature 🌿`, `Love ❤️`, `Politics 🏛️`, `Humor 😂`, `Sadness 🌧️`).
- Alternating image & gradient cards with italic quote text and "See All →" action buttons.

### 6. 🔷 Post Creation Screen
- **Live Canvas Preview**: Real-time rendering as you type or change style/background.
- **Formatting Toolbar**: Bold, Italic, Text Alignment cycling (Left/Center/Right).
- **Background Selector**: Image picker (5 curated themes) & Solid Color picker (7 dark shades).
- **Text Color Swatches** & Category Selector chips.
- **Actions**: `Save Draft` (alert modal) & `Post Now` (gradient button).

### 7. 🔷 Profile Screen
- Cover photo header fading to white with an animated gradient ring avatar (`96dp`).
- User handle, verified checkmark, PRO badge, multi-line bio, and website link.
- Stats row: `Posts | Followers | Following` separated by clean vertical dividers.
- **3 Tab Views**: `Posts` (grid), `Saved` (bookmarked), `Liked` (favorite quotes).

### 8. 🔷 3-Dot Post Options Bottom Sheet
- Slide-up bottom sheet with post snippet preview.
- Colored icon action rows:
  - 🟣 `Share to Story`
  - 🟢 `Copy Link`
  - 🟡 `Turn on / off notifications`
  - 🟩 `Follow / Unfollow author`
  - 🔴 `Report Post` (danger zone)

---

## 🎨 Design System

| Token | Hex / Spec | Description |
|---|---|---|
| **Primary** | `#0F3D3E` | Dark Green |
| **Primary Light** | `#11998E` | Teal Green Tint |
| **Accent** | `#F26B8A` | Pink Highlight |
| **Background** | `#FFFFFF` | White |
| **Text Primary** | `#222222` | Dark Charcoal |
| **Text Secondary** | `#888888` | Muted Grey |

---

## 📁 Project Structure

```
d:/mansoo/mansoo-expo/
├── App.js                         # Application Root Entry
├── app.json                       # Expo configuration
├── package.json                   # Project dependencies
├── firebase.js                    # Firebase Initialization & Auth/Firestore config
├── README.md                      # Project documentation
│
└── src/
    ├── theme/
    │   ├── colors.js              # Design System color tokens
    │   └── typography.js          # Font sizes & text styles
    │
    ├── data/
    │   └── dummyData.js           # Sample posts, users, categories & notifications
    │
    ├── components/
    │   ├── AnimatedHeart.js       # Reusable scale-bounce heart animation
    │   ├── StoryBar.js            # Horizontal stories with gradient rings
    │   ├── FeaturedSection.js     # Top post hero carousel
    │   ├── UserSuggestions.js     # "People You May Know" horizontal cards
    │   ├── PostCard.js            # Main post feed card
    │   ├── CategorySection.js     # Category row component
    │   ├── StaggeredGrid.js       # 2-column Pinterest layout
    │   └── PostOptionsSheet.js    # 3-dot bottom sheet menu
    │
    ├── screens/
    │   ├── SplashScreen.js        # Animated splash screen
    │   ├── LoginScreen.js         # Login with Email & Google
    │   ├── HomeScreen.js          # Main feed screen
    │   ├── ExploreScreen.js       # Search & Pinterest grid
    │   ├── CategoryScreen.js      # Category explore screen
    │   ├── CreateScreen.js        # Post creator with live canvas
    │   ├── ProfileScreen.js       # User profile with cover & stats
    │   └── NotificationsScreen.js # Activity notifications list
    │
    └── navigation/
        ├── TabNavigator.js        # 5-tab bottom navigation with center FAB
        └── AppNavigator.js        # Root Native Stack navigator
```

---

## 🚀 How to Run the App

### 1. Install Dependencies
Navigate to `d:\mansoo\mansoo-expo` and run:
```bash
npm install
```

### 2. Start Expo Development Server
```bash
npx expo start
```

- Press `a` to open on an **Android Emulator** / device.
- Press `i` to open on an **iOS Simulator**.
- Scan the QR code using the **Expo Go** app on your physical iOS or Android phone.

---

## 🔥 Firebase Setup Instructions

To connect your own live Firebase backend:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project named **Mansoo**.
2. Register a Web App inside your Firebase project.
3. Copy your project `firebaseConfig` object.
4. Paste the credentials into `d:\mansoo\mansoo-expo\firebase.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "mansoo-app.firebaseapp.com",
     projectId: "mansoo-app",
     storageBucket: "mansoo-app.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```
5. Enable **Authentication** (Email/Password & Google) and **Cloud Firestore** in Firebase Console.
