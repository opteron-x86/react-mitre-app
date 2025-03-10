// src/components/Dashboard/GlobalFilters.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
  Divider,
  SelectChangeEvent,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TACTIC_TITLE } from '@/data/tacticOrder';

export interface FilterState {
  selectedTactics: string[];
  selectedPlatforms: string[];
  selectedDataSources: string[];
  ruleExistence: boolean;
  validatedOnly: boolean;
  searchText: string;
}

interface GlobalFiltersProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  allTactics: string[];
  allPlatforms: string[];
  allDataSources: string[];
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  filterState,
  setFilterState,
  allTactics,
  allPlatforms,
  allDataSources,
  isCollapsed,
  toggleCollapse,
}) => {
  const handleTacticsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFilterState((prev) => ({
      ...prev,
      selectedTactics: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handlePlatformsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFilterState((prev) => ({
      ...prev,
      selectedPlatforms: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleDataSourcesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFilterState((prev) => ({
      ...prev,
      selectedDataSources: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleRuleExistenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({
      ...prev,
      ruleExistence: event.target.checked,
    }));
  };

  const handleValidatedOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({
      ...prev,
      validatedOnly: event.target.checked,
    }));
  };

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({
      ...prev,
      searchText: event.target.value,
    }));
  };

  const clearFilters = () => {
    setFilterState({
      selectedTactics: [],
      selectedPlatforms: [],
      selectedDataSources: [],
      ruleExistence: false,
      validatedOnly: false,
      searchText: '',
    });
  };

  if (isCollapsed) {
    return (
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Filters
          {(filterState.selectedTactics.length > 0 ||
            filterState.selectedPlatforms.length > 0 ||
            filterState.selectedDataSources.length > 0 ||
            filterState.ruleExistence ||
            filterState.validatedOnly ||
            filterState.searchText) && (
            <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.8rem' }}>
              (Active)
            </Typography>
          )}
        </Typography>
        <IconButton onClick={toggleCollapse} size="small">
          <FilterListIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <Box>
          <Button variant="text" size="small" onClick={clearFilters} sx={{ mr: 1 }}>
            Clear All
          </Button>
          <IconButton onClick={toggleCollapse} size="small">
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Tactic Filter */}
        <FormControl sx={{ minWidth: 180, flex: 1 }}>
          <InputLabel id="tactic-filter-label">Tactics</InputLabel>
          <Select
            labelId="tactic-filter-label"
            multiple
            value={filterState.selectedTactics}
            label="Tactics"
            onChange={handleTacticsChange}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>All Tactics</em>;
              }
              return selected.map((tactic) => TACTIC_TITLE[tactic] || tactic).join(', ');
            }}
          >
            {allTactics.map((tactic) => (
              <MenuItem key={tactic} value={tactic}>
                {TACTIC_TITLE[tactic] || tactic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Platform Filter */}
        <FormControl sx={{ minWidth: 180, flex: 1 }}>
          <InputLabel id="platform-filter-label">Platforms</InputLabel>
          <Select
            labelId="platform-filter-label"
            multiple
            value={filterState.selectedPlatforms}
            label="Platforms"
            onChange={handlePlatformsChange}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>All Platforms</em>;
              }
              return selected.join(', ');
            }}
          >
            {allPlatforms.map((platform) => (
              <MenuItem key={platform} value={platform}>
                {platform}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Data Sources Filter */}
        <FormControl sx={{ minWidth: 180, flex: 1 }}>
          <InputLabel id="datasource-filter-label">Data Sources</InputLabel>
          <Select
            labelId="datasource-filter-label"
            multiple
            value={filterState.selectedDataSources}
            label="Data Sources"
            onChange={handleDataSourcesChange}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>All Data Sources</em>;
              }
              return selected.join(', ');
            }}
          >
            {allDataSources.map((dataSource) => (
              <MenuItem key={dataSource} value={dataSource}>
                {dataSource}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search */}
        <TextField
          label="Search Techniques"
          value={filterState.searchText}
          onChange={handleSearchTextChange}
          variant="outlined"
          size="medium"
          sx={{ minWidth: 220, flex: 1 }}
        />
      </Box>

      <Box sx={{ display: 'flex', mt: 2, alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filterState.ruleExistence}
              onChange={handleRuleExistenceChange}
              color="primary"
            />
          }
          label="Only show techniques with rules"
        />
        <Tooltip title="Only show techniques that have at least one detection rule">
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <FormControlLabel
          control={
            <Checkbox
              checked={filterState.validatedOnly}
              onChange={handleValidatedOnlyChange}
              color="primary"
            />
          }
          label="Only show validated rules"
        />
        <Tooltip title="Only show techniques with validated detection rules">
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default GlobalFilters;