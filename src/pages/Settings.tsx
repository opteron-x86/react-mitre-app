// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SyncIcon from '@mui/icons-material/Sync';
import HistoryIcon from '@mui/icons-material/History';
import WarningIcon from '@mui/icons-material/Warning';
import { RepositoryConfig, IndexingOptions } from '../components/SetupWizard/types';
import IndexingService from '../services/IndexingService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * Tab panel component
 */
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Settings page component for managing dashboard configuration
 */
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repositoryConfig, setRepositoryConfig] = useState<RepositoryConfig | null>(null);
  const [indexingOptions, setIndexingOptions] = useState<IndexingOptions | null>(null);
  const [indexingHistory, setIndexingHistory] = useState<any[]>([]);
  const [isReindexDialogOpen, setIsReindexDialogOpen] = useState(false);
  const [reindexingInProgress, setReindexingInProgress] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        
        // In a real app, you'd fetch these from your API
        // For now, we'll simulate a successful response
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setRepositoryConfig({
          repositoryUrl: 'https://github.com/example/detection-rules',
          branch: 'main',
          accessToken: '', // Don't display the actual token
          repositoryType: 'github',
          rulePaths: ['rules/windows', 'rules/linux'],
        });
        
        setIndexingOptions({
          includeSubdirectories: true,
          filePatterns: ['*.yml', '*.yaml', '*.json'],
          excludePatterns: ['*test*', '*example*'],
          updateFrequency: 'daily',
        });
        
        // Fetch indexing history
        try {
          const history = await IndexingService.getIndexingHistory();
          setIndexingHistory(history);
        } catch (historyError) {
          console.error('Failed to load indexing history:', historyError);
          // Don't fail the entire page load for this
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError('Failed to load settings. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenReindexDialog = () => {
    setIsReindexDialogOpen(true);
  };

  const handleCloseReindexDialog = () => {
    setIsReindexDialogOpen(false);
  };

  const handleStartReindexing = async () => {
    try {
      setReindexingInProgress(true);
      
      // In a real app, you'd call your API to start reindexing
      // For demonstration, we'll simulate a successful request
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After "successful" reindexing, close the dialog
      setIsReindexDialogOpen(false);
      
      // Show a success message or update the UI accordingly
      alert('Reindexing started successfully. You can monitor progress in the Indexing History tab.');
      
      // Optionally, refresh the indexing history
      const history = await IndexingService.getIndexingHistory();
      setIndexingHistory(history);
    } catch (err) {
      console.error('Error starting reindexing:', err);
      alert('Failed to start reindexing. Please try again.');
    } finally {
      setReindexingInProgress(false);
    }
  };

  // If loading, show loading indicator
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ my: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your MITRE ATT&CK Dashboard configuration and indexing settings.
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            aria-label="settings tabs"
          >
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Configuration" />
            <Tab icon={<SyncIcon />} iconPosition="start" label="Indexing" />
            <Tab icon={<HistoryIcon />} iconPosition="start" label="Indexing History" />
          </Tabs>
        </Box>

        {/* Configuration Tab */}
        <TabPanel value={activeTab} index={0}>
          {repositoryConfig && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Repository Configuration
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
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
                      secondary="[Hidden for security]" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Rule Paths" />
                  </ListItem>
                  <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    {repositoryConfig.rulePaths.length > 0 ? (
                      repositoryConfig.rulePaths.map(path => (
                        <Chip 
                          key={path} 
                          label={path} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Entire repository
                      </Typography>
                    )}
                  </Box>
                </List>
              </Paper>
              
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => alert('This would open a dialog to edit repository settings')}
                sx={{ mb: 4 }}
              >
                Edit Repository Settings
              </Button>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Danger Zone
              </Typography>
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  borderColor: 'error.main', 
                  backgroundColor: 'error.light', 
                  color: 'error.contrastText' 
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Reset Dashboard Configuration
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  This will remove all your configuration settings and require you to go through
                  the setup process again. This action cannot be undone.
                </Typography>
                <Button 
                  variant="contained"
                  color="error"
                  onClick={() => alert('This would reset your dashboard configuration')}
                >
                  Reset Configuration
                </Button>
              </Paper>
            </Box>
          )}
        </TabPanel>

        {/* Indexing Tab */}
        <TabPanel value={activeTab} index={1}>
          {indexingOptions && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Indexing Options
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
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
                  <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
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
                  
                  <ListItem>
                    <ListItemText primary="Patterns to Exclude" />
                  </ListItem>
                  <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
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
              
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => alert('This would open a dialog to edit indexing options')}
                sx={{ mb: 4 }}
              >
                Edit Indexing Options
              </Button>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Manual Reindexing
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="body1" paragraph>
                  You can manually trigger a reindexing of your detection rules. This will 
                  fetch the latest changes from your repository and update the MITRE ATT&CK mappings.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<SyncIcon />}
                  onClick={handleOpenReindexDialog}
                >
                  Start Reindexing
                </Button>
              </Paper>
            </Box>
          )}
        </TabPanel>

        {/* Indexing History Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Indexing History
          </Typography>
          
          {indexingHistory.length > 0 ? (
            <Paper variant="outlined" sx={{ p: 0 }}>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {indexingHistory.map((job, index) => (
                  <React.Fragment key={job.jobId || index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">
                              Indexing Job 
                              <Box component="span" sx={{ ml: 1, fontFamily: 'monospace', fontSize: '0.85em' }}>
                                {job.jobId}
                              </Box>
                            </Typography>
                            <Chip
                              label={job.status}
                              color={
                                job.status === 'completed' ? 'success' :
                                job.status === 'failed' ? 'error' :
                                job.status === 'in-progress' ? 'info' : 'default'
                              }
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Started: {new Date(job.startedAt).toLocaleString()}
                            </Typography>
                            {job.completedAt && (
                              <Typography
                                component="div"
                                variant="body2"
                                color="text.primary"
                              >
                                Completed: {new Date(job.completedAt).toLocaleString()}
                              </Typography>
                            )}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < indexingHistory.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <Alert severity="info">
              No indexing history available.
            </Alert>
          )}
        </TabPanel>
      </Paper>

      {/* Reindex Confirmation Dialog */}
      <Dialog
        open={isReindexDialogOpen}
        onClose={handleCloseReindexDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Start Reindexing
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will start a new indexing job to update your detection rules and MITRE ATT&CK mappings.
            The process may take several minutes depending on the size of your repository.
            Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReindexDialog} disabled={reindexingInProgress}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartReindexing} 
            autoFocus 
            variant="contained"
            color="primary"
            disabled={reindexingInProgress}
            startIcon={reindexingInProgress ? <CircularProgress size={20} /> : null}
          >
            {reindexingInProgress ? 'Starting...' : 'Start Reindexing'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;