// Theme Context Provider supporting Light and Dark modes dynamically
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  LIGHT_PALETTE,
  DARK_PALETTE,
  SPACING,
  RADIUS,
  TYPOGRAPHY_SCALE,
  SHADOWS
} from './tokens';

const ThemeContext = createContext({
  theme: LIGHT_PALETTE,
  isDarkMode: false,
  toggleTheme: () => {},
  spacing: SPACING,
  radius: RADIUS,
  typography: TYPOGRAPHY_SCALE,
  shadows: SHADOWS,
});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? DARK_PALETTE : LIGHT_PALETTE;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: theme,
        isDarkMode,
        toggleTheme,
        spacing: SPACING,
        radius: RADIUS,
        typography: TYPOGRAPHY_SCALE,
        shadows: SHADOWS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
