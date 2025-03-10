// src/components/Auth/ProtectedFeatureIndicator.tsx
import React, { ReactNode } from 'react';
import { Box, Tooltip, Typography, SxProps, Theme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useAuthContext } from '@/hooks/useAuthContext';

interface ProtectedFeatureIndicatorProps {
  children: ReactNode;
  tooltipText?: string;
  sx?: SxProps<Theme>;
}

/**
 * Visual indicator for features that require authentication.
 * Shows a lock icon for unauthenticated users.
 */
const ProtectedFeatureIndicator: React.FC<ProtectedFeatureIndicatorProps> = ({ 
  children, 
  tooltipText = 'Authentication required',
  sx = {}
}) => {
  const { isAuthenticated } = useAuthContext();

  // If authenticated, just render the children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, render with lock indicator
  return (
    <Tooltip title={tooltipText}>
      <Box 
        sx={{ 
          position: 'relative', 
          display: 'inline-flex',
          alignItems: 'center',
          ...sx
        }}
      >
        {children}
        <Box
          sx={{
            position: 'absolute',
            top: -5,
            right: -5,
            bgcolor: 'background.paper',
            borderRadius: '50%',
            padding: 0.2,
            boxShadow: 1,
            color: 'warning.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LockIcon sx={{ fontSize: 14 }} />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default ProtectedFeatureIndicator;