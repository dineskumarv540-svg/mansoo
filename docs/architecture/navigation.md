# Navigation System Guide

Mansoo utilizes React Navigation (`@react-navigation/native-stack` and `@react-navigation/bottom-tabs`).

---

## 🧭 Navigation Hierarchy Diagram

```mermaid
graph TD
    Splash[SplashScreen] -->|Auth Check| MainTabs[TabNavigator]
    Splash -->|Unauthenticated| Onboarding[OnboardingScreen]
    Onboarding --> Login[LoginScreen]
    Login --> MainTabs
    
    subgraph MainTabs [5-Tab Navigator]
        Home[HomeScreen]
        Explore[ExploreScreen]
        Create[CreateScreen ➕]
        Favorites[CategoryScreen]
        Profile[ProfileScreen]
    end

    Home --> PostDetail[PostOptionsSheet / CommentsModal]
    Explore --> WritingRooms[WritingRoomsScreen]
    WritingRooms --> WritingRoomDetail[WritingRoomDetailScreen]
    Profile --> Settings[SettingsModal]
    Settings --> Privacy[PrivacyPolicyScreen]
    Settings --> Terms[TermsConditionsScreen]
    Settings --> DeleteAccount[DeleteAccountModal]
    Settings --> Support[SupportTicketModal]
```

---

## Related Guides
- [System Architecture](architecture.md)
- [State Management](state-management.md)
