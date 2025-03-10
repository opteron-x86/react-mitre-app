// src/components/Auth/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useAuthContext } from '@/hooks/useAuthContext';
import LockIcon from '@mui/icons-material/Lock';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that restricts access to authenticated users only.
 * If not authenticated, displays a fallback component or a default message.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading, login } = useAuthContext();

  // Allow navigation during loading to prevent flickering
  if (isLoading) {
    return <>{children}</>;
  }

  // If authenticated, render the children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, render the fallback or default message
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback UI
  return (
    <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', my: 4 }}>
      <LockIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Authentication Required
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You need to be logged in to access this feature.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={login}
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Paper>
  );
};

export default ProtectedRoute;