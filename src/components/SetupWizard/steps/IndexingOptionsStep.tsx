// src/components/SetupWizard/steps/IndexingOptionsStep.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  RadioGroup,
  Radio,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  Button,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IndexingOptions } from '../types';

interface IndexingOptionsStepProps {
  options: IndexingOptions;
  onChange: (options: Partial<IndexingOptions>) => void;
}

/**
 * Indexing Options step where users configure how the rules should be indexed
 */
const IndexingOptionsStep: React.FC<IndexingOptionsStepProps> = ({
  options,
  onChange,
}) => {
  const [newPattern, setNewPattern] = useState('');
  const [newExcludePattern, setNewExcludePattern] = useState('');

  const handleSubdirectoriesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ includeSubdirectories: event.target.checked });
  };

  const handleUpdateFrequencyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      updateFrequency: event.target.value as 'once' | 'hourly' | 'daily' | 'weekly',
    });
  };

  const handleAddPattern = () => {
    if (newPattern && !options.filePatterns.includes(newPattern)) {
      onChange({ filePatterns: [...options.filePatterns, newPattern] });
      setNewPattern('');
    }
  };

  const handleRemovePattern = (pattern: string) => {
    onChange({
      filePatterns: options.filePatterns.filter((p) => p !== pattern),
    });
  };

  const handleAddExcludePattern = () => {
    if (
      newExcludePattern &&
      !options.excludePatterns.includes(newExcludePattern)
    ) {
      onChange({
        excludePatterns: [...options.excludePatterns, newExcludePattern],
      });
      setNewExcludePattern('');
    }
  };

  const handleRemoveExcludePattern = (pattern: string) => {
    onChange({
      excludePatterns: options.excludePatterns.filter((p) => p !== pattern),
    });
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Indexing Options
      </Typography>

      <Typography variant="body1" paragraph>
        Configure how the detection rules should be indexed and updated.
      </Typography>

      <FormGroup sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={options.includeSubdirectories}
              onChange={handleSubdirectoriesChange}
            />
          }
          label="Include subdirectories when scanning for rules"
        />
      </FormGroup>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          File Patterns to Include
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Specify file patterns to include in the indexing process (e.g., *.yml, *.json).
        </Typography>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            label="Pattern"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            placeholder="e.g., *.yml"
            sx={{ mr: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    color="primary"
                    onClick={handleAddPattern}
                    disabled={!newPattern}
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {options.filePatterns.map((pattern) => (
            <Chip
              key={pattern}
              label={pattern}
              onDelete={() => handleRemovePattern(pattern)}
              deleteIcon={<DeleteIcon />}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        {options.filePatterns.length === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            At least one file pattern is required to proceed.
          </Alert>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Patterns to Exclude
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Specify patterns to exclude from indexing (e.g., *test*, *demo*).
        </Typography>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            label="Exclude Pattern"
            value={newExcludePattern}
            onChange={(e) => setNewExcludePattern(e.target.value)}
            placeholder="e.g., *test*"
            sx={{ mr: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    color="primary"
                    onClick={handleAddExcludePattern}
                    disabled={!newExcludePattern}
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {options.excludePatterns.map((pattern) => (
            <Chip
              key={pattern}
              label={pattern}
              onDelete={() => handleRemoveExcludePattern(pattern)}
              deleteIcon={<DeleteIcon />}
              color="error"
              variant="outlined"
            />
          ))}
        </Box>
        {options.excludePatterns.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No exclusion patterns defined.
          </Typography>
        )}
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Update Frequency
      </Typography>
      <Typography variant="body2" paragraph>
        How often should the index be updated?
      </Typography>

      <FormControl component="fieldset">
        <RadioGroup
          value={options.updateFrequency}
          onChange={handleUpdateFrequencyChange}
        >
          <Stack spacing={1}>
            <FormControlLabel
              value="once"
              control={<Radio />}
              label="Once (manual updates only)"
            />
            <FormControlLabel
              value="daily"
              control={<Radio />}
              label="Daily (recommended)"
            />
            <FormControlLabel value="hourly" control={<Radio />} label="Hourly" />
            <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
          </Stack>
        </RadioGroup>
      </FormControl>
      
      <Alert 
        severity="info" 
        icon={<InfoOutlinedIcon />}
        sx={{ mt: 3 }}
      >
        You can always modify these settings or manually trigger updates later from the dashboard settings.
      </Alert>
    </Box>
  );
};

export default IndexingOptionsStep;