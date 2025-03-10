// src/components/Dashboard/visualizations/index.tsx
import React from 'react';
import { SvgIconComponent } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import ScoreIcon from '@mui/icons-material/Score';
import TableChartIcon from '@mui/icons-material/TableChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Technique, Rule, RulesIndex } from '@/types';
import { FilterState } from '../GlobalFilters';

// Import visualization components
import MetricsOverview from './MetricsOverview';
import CoverageBarChart from './CoverageBarChart';
import CoveragePercentageChart from './CoveragePercentageChart';
import SummaryOverview from './SummaryOverview';

// Define the common interface for all visualization components
export interface VisualizationProps {
  techniques: Technique[];
  rules: Rule[];
  index: RulesIndex | null;
  filterState: FilterState;
}

// Define the configuration for each visualization
export interface VisualizationConfig {
  key: string;
  label: string;
  description: string;
  icon: React.ReactElement<SvgIconComponent>;
  component: React.ComponentType<VisualizationProps>;
}

// Register all available visualizations
export const availableVisualizations: VisualizationConfig[] = [
  {
    key: 'summary-overview',
    label: 'Dashboard Summary',
    description: 'High-level overview of dashboard metrics',
    icon: <DashboardIcon />,
    component: SummaryOverview
  },
  {
    key: 'metrics-overview',
    label: 'Metrics',
    description: 'Overview of coverage metrics and statistics',
    icon: <TableChartIcon />,
    component: MetricsOverview
  },
  {
    key: 'coverage-distribution',
    label: 'Coverage Distribution',
    description: 'Stacked bar chart showing covered vs. uncovered techniques by tactic',
    icon: <BarChartIcon />,
    component: CoverageBarChart
  },
  {
    key: 'coverage-ranking',
    label: 'Coverage Ranking',
    description: 'Horizontal bar chart ranking tactics by coverage percentage',
    icon: <ScoreIcon />,
    component: CoveragePercentageChart
  }
];

// Helper function to get a visualization by key
export function getVisualization(key: string): VisualizationConfig | undefined {
  return availableVisualizations.find(viz => viz.key === key);
}

// Export visualization components for direct imports if needed
export { 
  SummaryOverview,
  MetricsOverview,
  CoverageBarChart,
  CoveragePercentageChart
};