// src/hooks/useThemeMode.ts
import { useState, useMemo, useEffect, useCallback } from 'react';
import { PaletteMode } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';

/**
 * Storage key for persisting theme preference
 */
const THEME_MODE_STORAGE_KEY = 'mitre-dashboard-theme-mode';

/**
 * Custom hook to toggle between light and dark theme modes with localStorage persistence.
 * This enhanced version includes proper state initialization and 
 * ensures the theme is correctly applied to the document.
 */
export const useThemeMode = (): {
  theme: Theme;
  toggleTheme: () => void;
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
} => {
  // Initialize theme from localStorage or fallback to system preference or 'light'
  const [mode, setModeState] = useState<PaletteMode>(() => {
    // When running in browser environment
    if (typeof window !== 'undefined') {
      // First try to get from localStorage
      const savedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY);
      if (savedMode === 'light' || savedMode === 'dark') {
        return savedMode as PaletteMode;
      }
      
      // Then try to detect system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    // Default to light mode
    return 'light';
  });

  // Set mode with persistent storage
  const setMode = useCallback((newMode: PaletteMode) => {
    setModeState(newMode);
    localStorage.setItem(THEME_MODE_STORAGE_KEY, newMode);
  }, []);

  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  }, [mode, setMode]);

  // Memoize the theme to prevent unnecessary recalculations
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // Customize palette colors for light/dark mode
          ...(mode === 'light'
            ? {
                // Light mode palette customization
                primary: {
                  main: '#1976d2',
                },
                secondary: {
                  main: '#dc004e',
                },
                background: {
                  default: '#f5f5f5',
                  paper: '#ffffff',
                },
              }
            : {
                // Dark mode palette customization
                primary: {
                  main: '#90caf9',
                },
                secondary: {
                  main: '#f48fb1',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#bbbbbb',
                },
              }),
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                transition: 'background-color 0.3s ease',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.5)' : undefined,
              },
            },
          },
          // Improve chip visibility in dark mode
          MuiChip: {
            styleOverrides: {
              root: {
                ...(mode === 'dark' && {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }),
              },
            },
          },
        },
      }),
    [mode],
  );

  // Apply theme to document body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = 
        mode === 'dark' ? theme.palette.background.default : '#f5f5f5';
      document.body.style.color = 
        mode === 'dark' ? theme.palette.text.primary : '#000000';
      
      // Set a data attribute on the body for potential CSS selectors
      document.body.setAttribute('data-theme-mode', mode);

      // Set a class on the html element for broader styling hooks
      document.documentElement.classList.remove('light-mode', 'dark-mode');
      document.documentElement.classList.add(`${mode}-mode`);
    }
    
    // Debug logging to trace theme changes
    console.log('Theme mode set to:', mode);
    
    // Cleanup effect
    return () => {
      if (typeof document !== 'undefined') {
        document.body.removeAttribute('data-theme-mode');
      }
    };
  }, [mode, theme]);

  return { theme, toggleTheme, mode, setMode };
};

export default useThemeMode;