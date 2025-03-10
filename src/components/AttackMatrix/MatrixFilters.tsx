// src/components/AttackMatrix/MatrixFilters.tsx
import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  TextField,
  Typography,
} from '@mui/material';
import { TACTIC_TITLE } from '@/data/tacticOrder';

interface MatrixFiltersProps {
  allTactics: string[];
  allPlatforms: string[];
  allDataSources: string[];
  selectedTactics: string[];
  selectedPlatforms: string[];
  selectedDataSources: string[];
  displayMode: 't-code' | 'name' | 'both';
  searchText: string;
  ruleExistence: boolean;
  validatedOnly: boolean;
  onTacticsChange: (value: string[]) => void;
  onPlatformsChange: (value: string[]) => void;
  onDataSourcesChange: (value: string[]) => void;
  onDisplayModeChange: (value: 't-code' | 'name' | 'both') => void;
  onSearchTextChange: (value: string) => void;
  onRuleExistenceChange: (value: boolean) => void;
  onValidatedOnlyChange: (value: boolean) => void;
}

const MatrixFilters: React.FC<MatrixFiltersProps> = ({
  allTactics,
  allPlatforms,
  allDataSources,
  selectedTactics,
  selectedPlatforms,
  selectedDataSources,
  displayMode,
  searchText,
  ruleExistence,
  validatedOnly,
  onTacticsChange,
  onPlatformsChange,
  onDataSourcesChange,
  onDisplayModeChange,
  onSearchTextChange,
  onRuleExistenceChange,
  onValidatedOnlyChange,
}) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {/* Tactic Filter */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="tactic-filter-label">Tactic</InputLabel>
        <Select
          labelId="tactic-filter-label"
          multiple
          value={selectedTactics}
          label="Tactic"
          onChange={(e) => {
            const val = e.target.value;
            onTacticsChange(typeof val === 'string' ? val.split(',') : val);
          }}
        >
          {allTactics.map((t) => (
            <MenuItem key={t} value={t}>
              {TACTIC_TITLE[t] || t}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Platform Filter */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="platform-filter-label">Platform</InputLabel>
        <Select
          labelId="platform-filter-label"
          multiple
          value={selectedPlatforms}
          label="Platform"
          onChange={(e) => {
            const val = e.target.value;
            onPlatformsChange(typeof val === 'string' ? val.split(',') : val);
          }}
        >
          {allPlatforms.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Data Sources Filter */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="datasource-filter-label">Data Sources</InputLabel>
        <Select
          labelId="datasource-filter-label"
          multiple
          value={selectedDataSources}
          label="Data Sources"
          onChange={(e) => {
            const val = e.target.value;
            onDataSourcesChange(typeof val === 'string' ? val.split(',') : val);
          }}
        >
          {allDataSources.map((ds) => (
            <MenuItem key={ds} value={ds}>
              {ds}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display Mode */}
      <FormControl component="fieldset">
        <Typography variant="subtitle2">Display Mode</Typography>
        <RadioGroup
          row
          value={displayMode}
          onChange={(e) => onDisplayModeChange(e.target.value as 't-code' | 'name' | 'both')}
        >
          <FormControlLabel value="t-code" control={<Radio />} label="T-code" />
          <FormControlLabel value="name" control={<Radio />} label="Name" />
          <FormControlLabel value="both" control={<Radio />} label="Both" />
        </RadioGroup>
      </FormControl>

      {/* Rule Filters */}
      <FormControlLabel
        control={
          <Checkbox 
            checked={ruleExistence} 
            onChange={(e) => onRuleExistenceChange(e.target.checked)} 
          />
        }
        label="Only with Rule"
      />
      <FormControlLabel
        control={
          <Checkbox 
            checked={validatedOnly} 
            onChange={(e) => onValidatedOnlyChange(e.target.checked)} 
          />
        }
        label="Only Validated Rule"
      />

      {/* Search */}
      <TextField 
        label="Search" 
        value={searchText} 
        onChange={(e) => onSearchTextChange(e.target.value)} 
      />
    </Box>
  );
};

export default MatrixFilters;