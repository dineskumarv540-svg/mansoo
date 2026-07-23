/**
 * Mansoo Unified Design System Tokens
 * Strictly defined 4px Grid, Typography Scale, Color Palettes, Border Radii, and Elevation System.
 */

export const SPACING = {
  none: 0,
  xs: 4,      // 4px grid base
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const TYPOGRAPHY_SCALE = {
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  h3: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  h4: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '500' },
  button: { fontSize: 15, lineHeight: 20, fontWeight: '700' },
  quote: { fontSize: 16, lineHeight: 24, fontStyle: 'italic' },
};

export const LIGHT_PALETTE = {
  isDark: false,
  primary: '#0F3D3E',       // Dark Emerald
  primaryLight: '#11998E',  // Teal Green
  accent: '#F26B8A',        // Rose Pink
  accentDark: '#D94F6E',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceLight: '#F6F7F9',
  cardBackground: '#FFFFFF',
  textPrimary: '#222222',
  textSecondary: '#777777',
  textMuted: '#AAAAAA',
  border: '#EEEEEE',
  divider: '#F0F0F0',
  proGold: '#FFB300',
  verified: '#1DA1F2',
  likeRed: '#E53935',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#E53935',
  gradientGreen: ['#0F3D3E', '#11998E'],
  gradientPink: ['#F26B8A', '#FF8C69'],
  gradientStory: ['#F26B8A', '#FFB347', '#DA22FF', '#9733EE'],
};

export const DARK_PALETTE = {
  isDark: true,
  primary: '#11998E',       // Radiant Teal
  primaryLight: '#1CD8C9',
  accent: '#F26B8A',        // Vibrant Rose
  accentDark: '#FF8C69',
  background: '#121212',
  surface: '#1E1E1E',
  surfaceLight: '#2A2A2A',
  cardBackground: '#1E1E1E',
  textPrimary: '#F0F0F0',
  textSecondary: '#AAAAAA',
  textMuted: '#666666',
  border: '#2C2C2C',
  divider: '#252525',
  proGold: '#FFC107',
  verified: '#38A1F3',
  likeRed: '#EF5350',
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  gradientGreen: ['#11998E', '#0F3D3E'],
  gradientPink: ['#F26B8A', '#D94F6E'],
  gradientStory: ['#F26B8A', '#FFB347', '#DA22FF', '#9733EE'],
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};
