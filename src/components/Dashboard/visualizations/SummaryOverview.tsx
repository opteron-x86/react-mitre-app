// src/components/Dashboard/visualizations/SummaryOverview.tsx
import React, { useEffect } from 'react';
import { Typography, Paper, Grid, Box, Chip } from '@mui/material';
import { RulesIndex } from '@/types';
import { VisualizationProps } from './index';

/**
 * SummaryOverview visualization component that displays key dashboard metrics.
 * This is a modernized version of the legacy DashboardSummary component.
 */
const SummaryOverview: React.FC<VisualizationProps> = ({ 
  techniques, 
  rules, 
  index,
  filterState 
}) => {
  // Debug logging to understand what we're getting
  useEffect(() => {
    console.log("SummaryOverview - index:", index);
    console.log("SummaryOverview - index metadata:", index?.metadata);
  }, [index]);

  // First check if index exists at all
  if (!index) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">Index data not available.</Typography>
      </Box>
    );
  }

  // Then specifically check for metadata
  if (!index.metadata) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">Index metadata not available.</Typography>
      </Box>
    );
  }

  // Extract values with fallbacks to handle potential missing properties
  const totalRules = index.metadata.totalRules || 0;
  const techniqueCount = index.metadata.techniqueCount || 0;

  // Safely calculate covered techniques
  let coveredTechniques = 0;
  try {
    if (index.techniqueIndex) {
      coveredTechniques = Object.values(index.techniqueIndex)
        .filter(item => item && item.ruleCount > 0)
        .length;
    }
  } catch (err) {
    console.error("Error calculating covered techniques:", err);
  }
  
  const coveragePercentage = techniqueCount > 0 ? (coveredTechniques / techniqueCount) * 100 : 0;
  
  // Determine coverage status
  const getCoverageStatus = () => {
    if (coveragePercentage >= 75) return { label: 'Good coverage', color: 'success' };
    if (coveragePercentage >= 50) return { label: 'Medium coverage', color: 'warning' };
    return { label: 'Low coverage', color: 'error' };
  };
  
  const coverageStatus = getCoverageStatus();

  // Calculate current filtered view statistics
  const filteredTechniquesCount = techniques ? techniques.length : 0;
  const filteredRulesCount = rules ? rules.length : 0;

  return (
    <Grid container spacing={3}>
      {/* Overall metrics */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Overall Dashboard Metrics
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Total Techniques:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {techniqueCount}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Covered Techniques:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {coveredTechniques} ({coveragePercentage.toFixed(1)}%)
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Total Rules:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {totalRules}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Coverage Status:
              </Typography>
              <Chip 
                label={coverageStatus.label} 
                color={coverageStatus.color as 'success' | 'warning' | 'error' | 'default'} 
                size="small" 
              />
            </Box>
          </Box>
        </Paper>
      </Grid>
      
      {/* Current View Statistics */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Current View Statistics
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Filtered Techniques:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {filteredTechniquesCount} of {techniqueCount}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Filtered Rules:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {filteredRulesCount} of {totalRules}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Active Filters:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {filterState && (
                  filterState.selectedTactics.length > 0 || 
                  filterState.selectedPlatforms.length > 0 || 
                  filterState.selectedDataSources.length > 0 || 
                  filterState.validatedOnly || 
                  filterState.ruleExistence || 
                  filterState.searchText
                ) ? 'Yes' : 'No'}
              </Typography>
            </Box>
            
            {/* Generation timestamp */}
            <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                Data generated: {index.metadata.generatedAt ? new Date(index.metadata.generatedAt).toLocaleString() : 'Unknown'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryOverview;