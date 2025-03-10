// src/components/Dashboard/ModularInsightsPanel.tsx (updated)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Divider,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Technique, Rule, RulesIndex } from '@/types';
import { FilterState } from './GlobalFilters';

// Import visualization components
import { availableVisualizations, VisualizationConfig } from './visualizations';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`insights-tabpanel-${index}`}
      aria-labelledby={`insights-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `insights-tab-${index}`,
    'aria-controls': `insights-tabpanel-${index}`,
  };
}

export interface ModularInsightsPanelProps {
  techniques: Technique[];
  rules: Rule[];
  index: RulesIndex | null;
  filterState: FilterState;
  /**
   * Optional array of visualization keys to display.
   * If not provided, all available visualizations will be shown.
   */
  visualizations?: string[];
  /**
   * Optional default tab index to show when the component mounts.
   * Defaults to 0 (first tab).
   */
  defaultTabIndex?: number;
  /**
   * Optional flag to determine if the panel should be expanded by default.
   * Defaults to true.
   */
  defaultExpanded?: boolean;
  /**
   * Optional title for the panel.
   */
  title?: string;
}

/**
 * A modular insights panel that can display different visualizations based on configuration.
 */
const ModularInsightsPanel: React.FC<ModularInsightsPanelProps> = ({
  techniques,
  rules,
  index,
  filterState,
  visualizations,
  defaultTabIndex = 0,
  defaultExpanded = true,
  title = "Coverage Insights"
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [tabValue, setTabValue] = useState(defaultTabIndex);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Debug logging to understand what we're getting
  useEffect(() => {
    console.log("ModularInsightsPanel - index:", index);
    setIsLoading(false);
  }, [index]);

  // Filter available visualizations if a specific subset is requested
  const activeVisualizations = visualizations
    ? availableVisualizations.filter(viz => visualizations.includes(viz.key))
    : availableVisualizations;

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // If no visualizations are available or requested, don't render the panel
  if (!activeVisualizations.length) {
    return null;
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <Paper sx={{ mb: 3, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Loading dashboard data...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BarChartIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <IconButton
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </IconButton>
      </Box>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        
        {activeVisualizations.length > 1 && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="insights tabs"
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : undefined}
            >
              {activeVisualizations.map((viz, index) => (
                <Tab 
                  key={viz.key}
                  icon={viz.icon} 
                  iconPosition="start" 
                  label={viz.label} 
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </Box>
        )}
        
        {activeVisualizations.map((viz, index) => (
          <TabPanel key={viz.key} value={tabValue} index={index}>
            <Box sx={{ p: 2 }}>
              <viz.component
                techniques={techniques}
                rules={rules}
                index={index || { metadata: {}, rules: [], techniqueIndex: {} }}
                filterState={filterState}
              />
            </Box>
          </TabPanel>
        ))}
      </Collapse>
    </Paper>
  );
};

export default ModularInsightsPanel;