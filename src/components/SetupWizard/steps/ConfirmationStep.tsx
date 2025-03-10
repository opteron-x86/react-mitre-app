// src/components/SetupWizard/steps/ConfirmationStep.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  LinearProgress,
  Stack,
  Alert
} from '@mui/material';
import { RepositoryConfig, IndexingOptions } from '../types';

interface ConfirmationStepProps {
  repositoryConfig: RepositoryConfig;
  indexingOptions: IndexingOptions;
  isIndexing: boolean;
  progress: number;
}

/**
 * Confirmation step that shows a summary of the user's selections
 * and displays progress during indexing
 */
const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  repositoryConfig,
  indexingOptions,
  isIndexing,
  progress
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Confirmation
      </Typography>

      <Typography variant="body1" paragraph>
        Please review your configuration before starting the indexing process.
      </Typography>

      {isIndexing ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Indexing in Progress
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 10, borderRadius: 1, mb: 2 }} 
          />
          <Typography variant="body2" color="text.secondary" align="center">
            {progress.toFixed(0)}% Complete
          </Typography>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            This process may take several minutes depending on the size of the repository.
            You can continue to use other parts of the application, and you'll be notified
            when the indexing is complete.
          </Alert>
        </Box>
      ) : (
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Repository Configuration
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Repository Type" 
                  secondary={repositoryConfig.repositoryType.toUpperCase()} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Repository URL" 
                  secondary={repositoryConfig.repositoryUrl} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Branch" 
                  secondary={repositoryConfig.branch} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Access Token" 
                  secondary={repositoryConfig.accessToken ? "Provided (will not be stored permanently)" : "Not provided"} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Rule Paths" 
                  secondary={
                    repositoryConfig.rulePaths.length > 0 
                      ? "Specific paths defined"
                      : "Entire repository will be scanned"
                  }
                />
              </ListItem>
              {repositoryConfig.rulePaths.length > 0 && (
                <Box sx={{ ml: 4, mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {repositoryConfig.rulePaths.map(path => (
                    <Chip 
                      key={path} 
                      label={path}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </List>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Indexing Options
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Include Subdirectories" 
                  secondary={indexingOptions.includeSubdirectories ? "Yes" : "No"} 
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="File Patterns to Include" />
              </ListItem>
              <Box sx={{ ml: 4, display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {indexingOptions.filePatterns.map(pattern => (
                  <Chip 
                    key={pattern} 
                    label={pattern}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              
              {indexingOptions.excludePatterns.length > 0 && (
                <>
                  <ListItem>
                    <ListItemText primary="Patterns to Exclude" />
                  </ListItem>
                  <Box sx={{ ml: 4, display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    {indexingOptions.excludePatterns.map(pattern => (
                      <Chip 
                        key={pattern} 
                        label={pattern}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </>
              )}
              
              <ListItem>
                <ListItemText 
                  primary="Update Frequency" 
                  secondary={
                    indexingOptions.updateFrequency === 'once' ? 'Once (manual updates only)' :
                    indexingOptions.updateFrequency === 'hourly' ? 'Hourly' :
                    indexingOptions.updateFrequency === 'daily' ? 'Daily' : 'Weekly'
                  } 
                />
              </ListItem>
            </List>
          </Paper>
          
          <Alert severity="info">
            When you click "Start Indexing", the system will begin cloning the repository and 
            indexing the detection rules. This will make them available in the MITRE ATT&CK Dashboard.
          </Alert>
        </Stack>
      )}
    </Box>
  );
};

export default ConfirmationStep;