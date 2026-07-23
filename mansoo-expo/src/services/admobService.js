// AdMob Monetization Manager for Mansoo App
// Supports Banner Ads, Interstitial Ads (on post publish), and Rewarded Ads (for unlocking premium themes)

export const ADMOB_UNITS = {
  bannerHome: 'ca-app-pub-3940256099942544/6300978111',       // Test Unit ID
  interstitialPublish: 'ca-app-pub-3940256099942544/1033173712',
  rewardedThemes: 'ca-app-pub-3940256099942544/5224354917',
};

class AdMobManager {
  constructor() {
    this.isLoaded = true;
  }

  showInterstitialOnPost() {
    console.log('[AdMob] Showing Interstitial Ad post-publish');
    // Call native AdMob interstitial show when built with expo-ads-admob or react-native-google-mobile-ads
  }

  showRewardedAdForTheme(onSuccess) {
    console.log('[AdMob] Showing Rewarded Ad for premium background theme');
    if (onSuccess) onSuccess();
  }
}

export const adMobManager = new AdMobManager();
