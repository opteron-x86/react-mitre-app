import React from 'react';
import { Typography, Paper } from '@mui/material';
import { RulesIndex } from '@/types';

interface DashboardSummaryProps {
  index: RulesIndex;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ index }) => {
  // Guard against missing metadata
  if (!index.metadata) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1">Index metadata not available.</Typography>
      </Paper>
    );
  }

  const { totalRules, techniqueCount } = index.metadata;

  // Calculate how many techniques have at least one rule (using techniqueIndex)
  const coveredTechniques = Object.values(index.techniqueIndex).filter(item => item.ruleCount > 0).length;
  const coveragePercentage = techniqueCount > 0 ? (coveredTechniques / techniqueCount) * 100 : 0;
  const coverageFeedback = coveragePercentage >= 75 ? 'Good coverage' : 'Low or sparse coverage';

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard Summary
      </Typography>
      <Typography variant="body1">
        Total Techniques: <strong>{techniqueCount}</strong>
      </Typography>
      <Typography variant="body1">
        Covered Techniques: <strong>{coveredTechniques}</strong> ({coveragePercentage.toFixed(1)}%)
      </Typography>
      <Typography variant="body1">
        Total Rules: <strong>{totalRules}</strong>
      </Typography>
      <Typography variant="body1">
        Coverage Feedback: <strong>{coverageFeedback}</strong>
      </Typography>
    </Paper>
  );
};

export default DashboardSummary;
