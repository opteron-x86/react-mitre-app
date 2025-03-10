// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Divider, 
  useMediaQuery, 
  useTheme,
  Tooltip
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '@/components/ThemeProvider';
import LoginButton from '@/components/Auth/LoginButton';
import UserProfile from '@/components/Auth/UserProfile';
import { useAuthContext } from '@/hooks/useAuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { mode, toggleTheme } = useThemeContext();
  const { isAuthenticated } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SAINT Explorer
          </Typography>
          
          {/* Display different elements based on authentication status */}
          {isAuthenticated ? (
            <UserProfile />
          ) : (
            <LoginButton 
              color="inherit" 
              variant="outlined" 
              size={isMobile ? "small" : "medium"}
            />
          )}
          
          <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme} 
              aria-label={mode === 'light' ? 'dark mode' : 'light mode'}
              sx={{ ml: 1 }}
              data-testid="theme-toggle-button"
            >
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      <Box 
        component="main"
        sx={{ 
          width: '100%', 
          padding: 2, 
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)', // Full height minus AppBar height
          transition: 'background-color 0.3s ease'
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default Layout;