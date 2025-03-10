// src/components/SetupWizard/steps/CompletionStep.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IndexingResult } from '../types';

interface CompletionStepProps {
  success: boolean;
  error?: string;
  result?: IndexingResult;
}

/**
 * Final step of the wizard that shows the result of the indexing process
 */
const CompletionStep: React.FC<CompletionStepProps> = ({
  success,
  error,
  result,
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {success ? (
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: 40, mr: 2 }}
          />
        ) : (
          <ErrorOutlineIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
        )}
        <Typography variant="h5">
          {success ? 'Setup Complete!' : 'Setup Encountered Issues'}
        </Typography>
      </Box>

      {success ? (
        <Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            Your MITRE ATT&CK Dashboard has been successfully configured and
            is ready to use.
          </Alert>

          {result && (
            <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Indexing Results
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Rules Indexed:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {result.rulesIndexed}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Techniques Covered:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {result.techniquesCovered}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Completed At:</Typography>
                  <Typography variant="body1">
                    {new Date(result.completedAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Index ID:</Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {result.indexId}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          <Typography variant="h6" gutterBottom>
            What's Next?
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <VisibilityIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Explore Your Dashboard"
                secondary="View your detection rules in the context of the MITRE ATT&CK framework"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BarChartIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Analyze Coverage"
                secondary="Identify gaps in your detection coverage"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Improve Defenses"
                secondary="Use insights to enhance your security posture"
              />
            </ListItem>
          </List>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/"
            >
              Go to Dashboard
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'An unexpected error occurred during the setup process.'}
          </Alert>

          <Typography variant="body1" paragraph>
            Don't worry, you can try again. Here are some common issues and how
            to fix them:
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Repository Access Issues"
                  secondary="Check if the repository URL is correct and the access token has the right permissions."
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Rule Format Problems"
                  secondary="Ensure your rules contain valid MITRE ATT&CK technique references."
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Network Connectivity"
                  secondary="Check if your system can connect to the repository."
                />
              </ListItem>
            </List>
          </Paper>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CompletionStep;