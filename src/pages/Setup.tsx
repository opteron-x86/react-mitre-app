// src/pages/Setup.tsx
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';
import SetupWizard from '../components/SetupWizard/SetupWizard';

/**
 * Setup page component that hosts the setup wizard
 * Handles checking if setup is required and showing appropriate UI
 */
const Setup: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isSetupRequired, setIsSetupRequired] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if setup is required when the component mounts
  useEffect(() => {
    const fetchSetupStatus = async () => {
      try {
        // Replace with your actual API endpoint to check setup status
        const response = await fetch('/api/setup/status');
        
        if (!response.ok) {
          throw new Error('Failed to check setup status');
        }
        
        const data = await response.json();
        setIsSetupRequired(data.setupRequired);
      } catch (error) {
        console.error('Error checking setup status:', error);
        setError('Failed to check setup status. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Comment this out in development to force showing the setup wizard
    // fetchSetupStatus();
    
    // For development/demo, just set loading to false after a delay
    setTimeout(() => {
      setLoading(false);
      setIsSetupRequired(true);
    }, 1000);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '70vh',
        textAlign: 'center',
        px: 2
      }}>
        <CircularProgress size={60} sx={{ mb: 4 }} />
        <Typography variant="h5">
          Checking setup status...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: "lg", mx: "auto", width: "100%" }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  // Show setup already complete state
  if (!isSetupRequired) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        p: 3, 
        minHeight: '70vh'
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Setup Already Complete
          </Typography>
          <Typography variant="body1" paragraph>
            Your MITRE ATT&CK Dashboard is already configured and ready to use.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              component={RouterLink}
              to="/"
              sx={{ mr: 2 }}
            >
              Go to Dashboard
            </Button>
            <Button 
              variant="outlined" 
              component={RouterLink}
              to="/settings"
            >
              View Settings
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // Show setup wizard
  return <SetupWizard />;
};

export default Setup;