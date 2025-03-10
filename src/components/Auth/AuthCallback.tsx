// src/components/Auth/AuthCallback.tsx
import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { useAuthContext } from '@/hooks/useAuthContext';

/**
 * Component to handle the OAuth callback and redirect flow.
 * This is shown while processing the authentication response.
 */
const AuthCallback: React.FC = () => {
  const { isLoading, error } = useAuthContext();

  // If there's an authentication error, display it
  if (error) {
    return (
      <Paper 
        sx={{ 
          p: 4, 
          maxWidth: 500, 
          mx: 'auto', 
          mt: 8, 
          textAlign: 'center',
          bgcolor: 'error.light'
        }}
      >
        <Typography variant="h6" color="error.main" gutterBottom>
          Authentication Error
        </Typography>
        <Typography variant="body1">
          {error.message || 'There was a problem logging you in. Please try again.'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Technical details: {error.name}
        </Typography>
      </Paper>
    );
  }

  // Show loading state
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h6">
        Processing authentication...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Please wait while we complete your sign-in.
      </Typography>
    </Box>
  );
};

export default AuthCallback;