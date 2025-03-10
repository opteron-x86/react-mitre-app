// src/components/ThemeProvider.tsx
import React, { ReactNode, createContext, useContext } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { PaletteMode } from '@mui/material';
import useThemeMode from '@/hooks/useThemeMode';

// Create a context to expose theme functionality throughout the app
interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
  setMode: (mode: PaletteMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook to access the theme context
 */
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Props for ThemeProvider component.
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component that provides Material UI theming (including dark/light mode) to its children.
 * This component ensures proper theme application throughout the application and exposes
 * theme controls via context.
 */
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, mode, toggleTheme, setMode } = useThemeMode();

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <MUIThemeProvider theme={theme}>
        {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;