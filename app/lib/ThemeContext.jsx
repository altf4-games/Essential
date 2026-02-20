import React, { createContext, useContext, useState } from 'react';

// --- Theme palettes ---
const darkTheme = {
  isDark: true,
  bg: '#1A1A1A',
  card: '#2A2A2A',
  text: '#FFFFFF',
  subtitle: '#999999',
  border: '#333333',
  accent: '#2e78b7',
};

const lightTheme = {
  isDark: false,
  bg: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1A1A1A',
  subtitle: '#666666',
  border: '#E0E0E0',
  accent: '#2e78b7',
};

// --- Context ---
const ThemeContext = createContext(darkTheme);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(prev => !prev);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
