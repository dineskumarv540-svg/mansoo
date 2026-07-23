// Theme Context Provider supporting Light and Dark modes dynamically
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

const LIGHT_THEME = {
  isDark: false,
  colors: {
    primary: '#0F3D3E',
    accent: '#F26B8A',
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
    textPrimary: '#222222',
    textSecondary: '#888888',
    border: '#F0F0F0',
  }
};

const DARK_THEME = {
  isDark: true,
  colors: {
    primary: '#11998E',
    accent: '#F26B8A',
    background: '#121212',
    cardBackground: '#1E1E1E',
    textPrimary: '#F0F0F0',
    textSecondary: '#AAAAAA',
    border: '#2C2C2C',
  }
};

const ThemeContext = createContext({
  theme: LIGHT_THEME,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
