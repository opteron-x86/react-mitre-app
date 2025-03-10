// src/components/AttackMatrix/MatrixLayout.tsx
import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { Technique, Rule } from '@/types';
import MatrixStatistics from './MatrixStatistics';
import RecommendationEngine from './RecommendationEngine';
import CoverageOverview from './CoverageOverview';
import MatrixContainer from './MatrixContainer';
import MatrixExport from './MatrixExport';

interface MatrixLayoutProps {
  techniques: Technique[];
  rules: Rule[];
}

const MatrixLayout: React.FC<MatrixLayoutProps> = ({ techniques = [], rules = [] }) => {
  // Ensure we're working with valid arrays
  const validTechniques = Array.isArray(techniques) ? techniques : [];
  const validRules = Array.isArray(rules) ? rules : [];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Main grid container */}
      <Grid container spacing={3}>
        {/* Statistics Panel - Left side */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper sx={{ p: 2 }}>
              <CoverageOverview techniques={validTechniques} rules={validRules} />
            </Paper>

            <Paper sx={{ p: 2 }}>
              <MatrixStatistics techniques={validTechniques} rules={validRules} />
            </Paper>

            <Paper sx={{ p: 2 }}>
              <RecommendationEngine techniques={validTechniques} rules={validRules} />
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <MatrixExport techniques={validTechniques} rules={validRules} />
            </Box>
          </Box>
        </Grid>

        {/* Matrix Container - Right side */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <MatrixContainer techniques={validTechniques} rules={validRules} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MatrixLayout;