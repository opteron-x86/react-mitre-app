// src/components/SetupWizard/steps/RepositoryConfigStep.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { RepositoryConfig } from '../types';

interface RepositoryConfigStepProps {
  config: RepositoryConfig;
  onChange: (config: Partial<RepositoryConfig>) => void;
}

/**
 * Repository configuration step where users input repository details
 */
const RepositoryConfigStep: React.FC<RepositoryConfigStepProps> = ({
  config,
  onChange,
}) => {
  const [showToken, setShowToken] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const repositoryTypes = [
    { value: 'github', label: 'GitHub' },
    { value: 'gitlab', label: 'GitLab' },
    { value: 'bitbucket', label: 'Bitbucket' },
    { value: 'azure-devops', label: 'Azure DevOps' },
    { value: 'local', label: 'Local File System' },
  ];

  const validateUrl = (url: string): boolean => {
    // Simple validation for repository URL
    try {
      new URL(url);
      setValidationErrors((prev) => ({ ...prev, repositoryUrl: '' }));
      return true;
    } catch (e) {
      if (url) {
        setValidationErrors((prev) => ({
          ...prev,
          repositoryUrl: 'Please enter a valid URL',
        }));
      }
      return false;
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    onChange({ repositoryUrl: url });
    validateUrl(url);
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ branch: event.target.value });
    if (!event.target.value) {
      setValidationErrors((prev) => ({
        ...prev,
        branch: 'Branch name is required',
      }));
    } else {
      setValidationErrors((prev) => ({ ...prev, branch: '' }));
    }
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ accessToken: event.target.value });
  };

  const handleRepositoryTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      repositoryType: event.target.value as
        | 'github'
        | 'gitlab'
        | 'bitbucket'
        | 'azure-devops'
        | 'local',
    });
  };

  const handleAddPath = () => {
    if (newPath && !config.rulePaths.includes(newPath)) {
      onChange({ rulePaths: [...config.rulePaths, newPath] });
      setNewPath('');
    }
  };

  const handleRemovePath = (path: string) => {
    onChange({
      rulePaths: config.rulePaths.filter((p) => p !== path),
    });
  };

  const toggleShowToken = () => {
    setShowToken(!showToken);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Repository Configuration
      </Typography>

      <Typography variant="body1" paragraph>
        Configure the repository containing your detection rules.
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <TextField
          select
          label="Repository Type"
          value={config.repositoryType}
          onChange={handleRepositoryTypeChange}
          helperText="Select the type of repository you're connecting to"
        >
          {repositoryTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>

      <TextField
        fullWidth
        label="Repository URL"
        value={config.repositoryUrl}
        onChange={handleUrlChange}
        margin="normal"
        placeholder="https://github.com/username/repository"
        error={!!validationErrors.repositoryUrl}
        helperText={
          validationErrors.repositoryUrl ||
          "The URL of the repository containing your detection rules"
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="The full URL to your Git repository">
                <HelpOutlineIcon color="action" fontSize="small" />
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Branch"
        value={config.branch}
        onChange={handleBranchChange}
        margin="normal"
        placeholder="main"
        error={!!validationErrors.branch}
        helperText={
          validationErrors.branch ||
          "The branch containing your detection rules (e.g., 'main' or 'master')"
        }
      />

      <TextField
        fullWidth
        label="Access Token (optional for private repositories)"
        type={showToken ? 'text' : 'password'}
        value={config.accessToken}
        onChange={handleTokenChange}
        margin="normal"
        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
        helperText="Personal access token with read permissions for private repositories"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle token visibility"
                onClick={toggleShowToken}
                edge="end"
              >
                {showToken ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Rule Paths
      </Typography>

      <Typography variant="body2" paragraph>
        Specify paths within the repository where detection rules are located.
        Leave empty to scan the entire repository.
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}>
        <TextField
          fullWidth
          label="Add Rule Path"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="e.g., rules/windows or detections/endpoint"
          size="small"
          sx={{ mr: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddPath}
          disabled={!newPath}
        >
          Add
        </Button>
      </Box>

      {config.rulePaths.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Paths to scan:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {config.rulePaths.map((path) => (
              <Chip
                key={path}
                label={path}
                onDelete={() => handleRemovePath(path)}
                deleteIcon={<DeleteIcon />}
              />
            ))}
          </Box>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mb: 2 }}>
          No specific paths added. The entire repository will be scanned.
        </Alert>
      )}

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.rulePaths.length === 0}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange({ rulePaths: [] });
                }
              }}
            />
          }
          label="Scan the entire repository"
        />
      </Box>
    </Box>
  );
};

export default RepositoryConfigStep;