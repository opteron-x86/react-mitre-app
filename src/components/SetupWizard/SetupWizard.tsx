// src/components/SetupWizard/SetupWizard.tsx
import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import WelcomeStep from './steps/WelcomeStep';
import RepositoryConfigStep from './steps/RepositoryConfigStep';
import IndexingOptionsStep from './steps/IndexingOptionsStep';
import ConfirmationStep from './steps/ConfirmationStep';
import CompletionStep from './steps/CompletionStep';
import { RepositoryConfig, IndexingOptions } from './types';
import { useSetupWizard } from '../../hooks/useSetupWizard';

const steps = [
  'Welcome',
  'Repository Configuration',
  'Indexing Options',
  'Confirmation',
  'Completion',
];

/**
 * Setup Wizard component that guides users through the process of
 * configuring and indexing rule repositories for the MITRE ATT&CK Dashboard.
 */
const SetupWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [repositoryConfig, setRepositoryConfig] = useState<RepositoryConfig>({
    repositoryUrl: '',
    branch: '',
    accessToken: '',
    repositoryType: 'github',
    rulePaths: [],
  });
  const [indexingOptions, setIndexingOptions] = useState<IndexingOptions>({
    includeSubdirectories: true,
    filePatterns: ['*.yml', '*.yaml', '*.json'],
    excludePatterns: ['*test*', '*demo*'],
    updateFrequency: 'daily',
  });

  const {
    isIndexing,
    indexingProgress,
    indexingError,
    startIndexing,
    indexingResult,
  } = useSetupWizard();

  const handleNext = () => {
    // If we're on the confirmation step, start the indexing process
    if (activeStep === 3) {
      startIndexing(repositoryConfig, indexingOptions);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRepositoryConfigChange = (config: Partial<RepositoryConfig>) => {
    setRepositoryConfig((prev) => ({ ...prev, ...config }));
  };

  const handleIndexingOptionsChange = (options: Partial<IndexingOptions>) => {
    setIndexingOptions((prev) => ({ ...prev, ...options }));
  };

  // Determine if the next button should be disabled
  const isNextDisabled = () => {
    switch (activeStep) {
      case 1: // Repository Configuration
        return !repositoryConfig.repositoryUrl || !repositoryConfig.branch;
      case 2: // Indexing Options
        return indexingOptions.filePatterns.length === 0;
      case 3: // Confirmation
        return isIndexing;
      default:
        return false;
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <WelcomeStep onContinue={handleNext} />;
      case 1:
        return (
          <RepositoryConfigStep
            config={repositoryConfig}
            onChange={handleRepositoryConfigChange}
          />
        );
      case 2:
        return (
          <IndexingOptionsStep
            options={indexingOptions}
            onChange={handleIndexingOptionsChange}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            repositoryConfig={repositoryConfig}
            indexingOptions={indexingOptions}
            isIndexing={isIndexing}
            progress={indexingProgress}
          />
        );
      case 4:
        return (
          <CompletionStep
            success={!indexingError}
            error={indexingError}
            result={indexingResult}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          MITRE ATT&CK Dashboard Setup
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4, pt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {indexingError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {indexingError}
          </Alert>
        )}

        {renderStepContent()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0 || activeStep === steps.length - 1 || isIndexing}
            onClick={handleBack}
          >
            Back
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isNextDisabled()}
              startIcon={
                isIndexing && activeStep === 3 ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {activeStep === 3 ? 'Start Indexing' : 'Next'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Go to Dashboard
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SetupWizard;