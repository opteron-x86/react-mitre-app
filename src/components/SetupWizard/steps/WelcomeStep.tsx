// src/components/SetupWizard/steps/WelcomeStep.tsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import GitHubIcon from '@mui/icons-material/GitHub';

interface WelcomeStepProps {
  onContinue: () => void;
}

/**
 * Welcome step of the setup wizard that explains the purpose and process
 */
const WelcomeStep: React.FC<WelcomeStepProps> = ({ onContinue }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h5" gutterBottom>
        Welcome to the MITRE ATT&CK Dashboard Setup
      </Typography>
      
      <Typography variant="body1" paragraph>
        This wizard will guide you through setting up your MITRE ATT&CK Dashboard 
        by configuring repositories containing detection rules and indexing them 
        for visualization in the dashboard.
      </Typography>
      
      <Typography variant="body1" paragraph>
        You'll need the following information to complete the setup:
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Repository URL" 
            secondary="The URL of the Git repository containing your detection rules" 
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Access Credentials" 
            secondary="Access token if the repository is private (we don't store this information)" 
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText 
            primary="File Locations" 
            secondary="The paths within the repository where your detection rules are located" 
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText 
            primary="MITRE References" 
            secondary="Your rules should contain references to MITRE ATT&CK techniques for proper visualization" 
          />
        </ListItem>
      </List>
      
      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
        This configuration process will help you replace the legacy rule indexer with a more flexible,
        user-controlled approach.
      </Typography>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={onContinue}
        >
          Let's Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomeStep;