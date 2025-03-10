// src/components/Dashboard/InsightsPanel.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Collapse,
  Divider,
  LinearProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Technique, Rule, RulesIndex } from '@/types';
import { TACTIC_ORDER, TACTIC_TITLE } from '@/data/tacticOrder';
import { FilterState } from './GlobalFilters';

interface InsightsPanelProps {
  techniques: Technique[];
  rules: Rule[];
  index: RulesIndex;
  filterState: FilterState;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ techniques, rules, index, filterState }) => {
  const [expanded, setExpanded] = useState(true);

  // Calculate filtered techniques and rules based on the filter state
  const filteredTechniques = techniques.filter((tech) => {
    // Apply tactic filter
    if (filterState.selectedTactics.length > 0 && !filterState.selectedTactics.includes(tech.tactic)) {
      return false;
    }
    
    // Apply platform filter
    if (filterState.selectedPlatforms.length > 0) {
      if (!tech.platforms || !tech.platforms.some((p) => filterState.selectedPlatforms.includes(p))) {
        return false;
      }
    }
    
    // Apply data source filter
    if (filterState.selectedDataSources.length > 0) {
      if (!tech.dataSources || !tech.dataSources.some((ds) => filterState.selectedDataSources.includes(ds))) {
        return false;
      }
    }
    
    // Apply search text filter
    if (filterState.searchText) {
      const searchLower = filterState.searchText.toLowerCase();
      if (!tech.name.toLowerCase().includes(searchLower) && 
          !tech.externalId.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

  const filteredRules = rules.filter((rule) => {
    // Apply validated only filter
    if (filterState.validatedOnly && !rule.validated) {
      return false;
    }
    
    // Check if rule is related to any of the filtered techniques
    if (filteredTechniques.length > 0) {
      const relatedTechniques = Array.isArray(rule.relatedTechniques) 
        ? rule.relatedTechniques 
        : [rule.relatedTechniques];
      
      return filteredTechniques.some((tech) => 
        relatedTechniques.includes(tech.externalId)
      );
    }
    
    return true;
  });

  // Calculate coverage metrics
  const calculateCoverage = () => {
    const coveredTechniqueIds = new Set<string>();
    
    filteredRules.forEach((rule) => {
      if (!rule.relatedTechniques) return;
      
      const relatedTechniques = Array.isArray(rule.relatedTechniques)
        ? rule.relatedTechniques
        : [rule.relatedTechniques];
      
      relatedTechniques.forEach((techId) => {
        if (techId) coveredTechniqueIds.add(techId);
      });
    });

    const totalTechniques = filteredTechniques.length;
    const coveredTechniques = filteredTechniques.filter(tech => 
      coveredTechniqueIds.has(tech.externalId)
    ).length;
    
    const coveragePercentage = totalTechniques > 0 
      ? (coveredTechniques / totalTechniques) * 100 
      : 0;

    // Calculate coverage by tactic
    const tacticCoverage: Record<string, { total: number; covered: number; percentage: number }> = {};
    
    // Initialize with all tactics from the order
    TACTIC_ORDER.forEach((tactic) => {
      tacticCoverage[tactic] = { total: 0, covered: 0, percentage: 0 };
    });
    
    // Count techniques by tactic
    filteredTechniques.forEach((tech) => {
      if (!tech || !tech.tactic) return;
      
      const tactic = tech.tactic;
      if (!tacticCoverage[tactic]) {
        tacticCoverage[tactic] = { total: 0, covered: 0, percentage: 0 };
      }
      
      tacticCoverage[tactic].total += 1;
      
      // Check if this technique is covered
      if (tech.externalId && coveredTechniqueIds.has(tech.externalId)) {
        tacticCoverage[tactic].covered += 1;
      }
    });
    
    // Calculate percentages for each tactic
    Object.keys(tacticCoverage).forEach((tactic) => {
      const { total, covered } = tacticCoverage[tactic];
      tacticCoverage[tactic].percentage = total > 0 ? (covered / total) * 100 : 0;
    });

    return {
      overall: {
        total: totalTechniques,
        covered: coveredTechniques,
        percentage: coveragePercentage,
      },
      byTactic: tacticCoverage,
    };
  };

  const coverage = calculateCoverage();

  // Find top critical gaps (techniques without rules)
  const findCriticalGaps = () => {
    // Get all technique IDs with rules
    const coveredTechniqueIds = new Set<string>();
    filteredRules.forEach((rule) => {
      if (!rule.relatedTechniques) return;
      
      const relatedTechniques = Array.isArray(rule.relatedTechniques)
        ? rule.relatedTechniques
        : [rule.relatedTechniques];
      
      relatedTechniques.forEach((techId) => {
        if (techId) coveredTechniqueIds.add(techId);
      });
    });
    
    // Find techniques without rules
    const uncoveredTechniques = filteredTechniques.filter(
      (tech) => !coveredTechniqueIds.has(tech.externalId) && !tech.isSubtechnique
    );
    
    // Sort by "criticality" (using tactic order as a proxy)
    return uncoveredTechniques
      .sort((a, b) => {
        const aTacticIndex = TACTIC_ORDER.indexOf(a.tactic);
        const bTacticIndex = TACTIC_ORDER.indexOf(b.tactic);
        return aTacticIndex - bTacticIndex;
      })
      .slice(0, 5);
  };

  const criticalGaps = findCriticalGaps();

  // Determine color based on coverage percentage
  const getCoverageColor = (percentage: number) => {
    if (percentage >= 75) return 'success.main';
    if (percentage >= 50) return 'warning.main';
    return 'error.main';
  };

  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BarChartIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Coverage Insights</Typography>
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
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            {/* Overall Coverage */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Overall Coverage
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Coverage Rate
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {coverage.overall.covered}/{coverage.overall.total} ({coverage.overall.percentage.toFixed(1)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={coverage.overall.percentage}
                  color={
                    coverage.overall.percentage >= 75 ? 'success' : 
                    coverage.overall.percentage >= 50 ? 'warning' : 'error'
                  }
                  sx={{ height: 10, borderRadius: 1, mt: 1 }}
                />
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Detection Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Techniques</Typography>
                  <Typography variant="body2" fontWeight="medium">{filteredTechniques.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Rules</Typography>
                  <Typography variant="body2" fontWeight="medium">{filteredRules.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Average Rules per Technique</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {coverage.overall.covered > 0 
                      ? (filteredRules.length / coverage.overall.covered).toFixed(1) 
                      : '0.0'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            {/* Coverage by Tactic */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Coverage by Tactic
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 300, overflowY: 'auto' }}>
                {TACTIC_ORDER
                  .filter(tactic => coverage.byTactic[tactic]?.total > 0)
                  .map((tactic) => {
                    const { total, covered, percentage } = coverage.byTactic[tactic];
                    if (total === 0) return null;
                    
                    return (
                      <Box key={tactic}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">{TACTIC_TITLE[tactic] || tactic}</Typography>
                          <Typography variant="body2">
                            {covered}/{total} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{ 
                            height: 8, 
                            borderRadius: 1, 
                            mt: 0.5,
                            bgcolor: 'grey.300',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getCoverageColor(percentage),
                            }
                          }}
                        />
                      </Box>
                    );
                  })}
              </Box>
            </Grid>
            
            {/* Critical Coverage Gaps */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom color="error.main">
                Critical Coverage Gaps
              </Typography>
              
              {criticalGaps.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 300, overflowY: 'auto' }}>
                  {criticalGaps.map((tech) => (
                    <Box 
                      key={tech.id} 
                      sx={{ 
                        p: 1, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {tech.externalId} - {tech.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tactic: {TACTIC_TITLE[tech.tactic] || tech.tactic}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No critical gaps found with current filters.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default InsightsPanel;