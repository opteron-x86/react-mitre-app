// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PaletteMode, ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';

// Storage key constant
const THEME_MODE_STORAGE_KEY = 'mitre-dashboard-theme-mode';

// Context types
interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
  theme: Theme;
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  theme: createTheme(),
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

// The provider component that wraps your app
export const AppThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or fallback
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY);
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode as PaletteMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Create the theme based on the current mode
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
                primary: { main: '#1976d2' },
                background: { default: '#f5f5f5', paper: '#ffffff' },
              }
            : {
                // Dark mode palette
                primary: { main: '#90caf9' },
                background: { default: '#121212', paper: '#1e1e1e' },
                text: { primary: '#ffffff', secondary: '#bbbbbb' },
              }),
        },
      }),
    [mode]
  );

  // Toggle theme function
  const toggleTheme = React.useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_MODE_STORAGE_KEY, newMode);
      return newMode;
    });
  }, []);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
  }, [mode, theme]);

  // Provide the context value to all children
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};