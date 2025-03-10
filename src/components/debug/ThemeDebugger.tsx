// src/components/debug/ThemeDebugger.tsx
import React from 'react';
import { Box, Typography, Paper, Button, useTheme } from '@mui/material';
import { useThemeMode } from '@/hooks/useThemeMode';

/**
 * Temporary component to debug theme issues.
 * Remove this component after theme issues are resolved.
 */
const ThemeDebugger: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();

  const localStorageMode = localStorage.getItem('mitre-dashboard-theme-mode');
  
  const resetThemePreference = () => {
    localStorage.removeItem('mitre-dashboard-theme-mode');
    window.location.reload();
  };

  const forceThemeMode = (newMode: 'light' | 'dark') => {
    localStorage.setItem('mitre-dashboard-theme-mode', newMode);
    window.location.reload();
  };

  return (
    <Paper sx={{ p: 2, my: 2, border: '1px dashed', borderColor: 'warning.main' }}>
      <Typography variant="h6" color="warning.main">Theme Debugger</Typography>
      <Box sx={{ my: 1 }}>
        <Typography variant="body2">
          Current theme mode from context: <strong>{mode}</strong>
        </Typography>
        <Typography variant="body2">
          Current theme mode from localStorage: <strong>{localStorageMode || 'not set'}</strong>
        </Typography>
        <Typography variant="body2">
          Current palette mode from theme object: <strong>{theme.palette.mode}</strong>
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
        <Button variant="outlined" size="small" onClick={toggleTheme}>
          Toggle Theme
        </Button>
        <Button variant="outlined" size="small" onClick={() => forceThemeMode('light')}>
          Force Light Mode
        </Button>
        <Button variant="outlined" size="small" onClick={() => forceThemeMode('dark')}>
          Force Dark Mode
        </Button>
        <Button variant="outlined" size="small" color="warning" onClick={resetThemePreference}>
          Reset Preference
        </Button>
      </Box>
    </Paper>
  );
};

export default ThemeDebugger;