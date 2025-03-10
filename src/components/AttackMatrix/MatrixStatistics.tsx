import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Rule, Technique } from '@/types';

interface MatrixStatisticsProps {
  techniques: Technique[];
  rules: Rule[];
}

const MatrixStatistics: React.FC<MatrixStatisticsProps> = ({ techniques = [], rules = [] }) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6">
        Matrix Statistics
      </Typography>
      <Typography>
        Techniques: {Array.isArray(techniques) ? techniques.length : 'N/A'}
      </Typography>
      <Typography>
        Rules: {Array.isArray(rules) ? rules.length : 'N/A'}
      </Typography>
    </Paper>
  );
};

export default MatrixStatistics;