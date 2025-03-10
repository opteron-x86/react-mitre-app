// src/components/Auth/LoginButton.tsx
import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useAuthContext } from '@/hooks/useAuthContext';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

interface LoginButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
}

const LoginButton: React.FC<LoginButtonProps> = ({ 
  variant = 'outlined',
  color = 'primary',
  size = 'medium'
}) => {
  const { isAuthenticated, isLoading, login, logout } = useAuthContext();

  // Show loading state
  if (isLoading) {
    return (
      <Button
        variant={variant}
        color={color}
        size={size}
        disabled
        startIcon={<CircularProgress size={16} />}
      >
        Loading...
      </Button>
    );
  }

  // Show login or logout button depending on auth state
  return isAuthenticated ? (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={logout}
      startIcon={<LogoutIcon />}
    >
      Logout
    </Button>
  ) : (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={login}
      startIcon={<LoginIcon />}
    >
      Login
    </Button>
  );
};

export default LoginButton;