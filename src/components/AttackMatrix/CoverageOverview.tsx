// src/components/AttackMatrix/CoverageOverview.tsx
import React, { useMemo } from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { Technique, Rule } from '@/types';
import { TACTIC_ORDER, TACTIC_TITLE } from '@/data/tacticOrder';

interface CoverageOverviewProps {
  techniques: Technique[];
  rules: Rule[];
}

const CoverageOverview: React.FC<CoverageOverviewProps> = ({ techniques = [], rules = [] }) => {
  // Ensure we're working with arrays
  const validTechniques = Array.isArray(techniques) ? techniques : [];
  const validRules = Array.isArray(rules) ? rules : [];
  
  // Calculate coverage metrics
  const coverageData = useMemo(() => {
    // Get unique technique IDs that have rules
    const coveredTechniqueIds = new Set<string>();
    
    validRules.forEach((rule) => {
      if (!rule || !rule.relatedTechniques) return;
      
      const relatedTechniques = Array.isArray(rule.relatedTechniques)
        ? rule.relatedTechniques
        : [rule.relatedTechniques];
      
      relatedTechniques.forEach((techId) => {
        if (techId) coveredTechniqueIds.add(techId);
      });
    });

    // Calculate overall coverage
    const totalTechniques = validTechniques.length;
    const coveredTechniques = Array.from(coveredTechniqueIds).length;
    const overallPercentage = totalTechniques > 0 
      ? (coveredTechniques / totalTechniques) * 100 
      : 0;

    // Calculate coverage by tactic
    const tacticCoverage: Record<string, { total: number; covered: number; percentage: number }> = {};
    
    // Initialize with all tactics
    TACTIC_ORDER.forEach((tactic) => {
      tacticCoverage[tactic] = { total: 0, covered: 0, percentage: 0 };
    });
    
    // Count techniques by tactic
    validTechniques.forEach((tech) => {
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
    
    // Calculate percentages
    Object.keys(tacticCoverage).forEach((tactic) => {
      const { total, covered } = tacticCoverage[tactic];
      tacticCoverage[tactic].percentage = total > 0 ? (covered / total) * 100 : 0;
    });

    return {
      overall: {
        total: totalTechniques,
        covered: coveredTechniques,
        percentage: overallPercentage,
      },
      byTactic: tacticCoverage,
    };
  }, [validTechniques, validRules]);

  // Determine color based on coverage percentage
  const getCoverageColor = (percentage: number) => {
    if (percentage >= 75) return 'success.main';
    if (percentage >= 50) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Coverage Overview
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Overall Coverage</Typography>
          <Typography variant="body2">
            {coverageData.overall.covered}/{coverageData.overall.total} ({coverageData.overall.percentage.toFixed(1)}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={coverageData.overall.percentage}
          color={
            coverageData.overall.percentage >= 75 ? 'success' : 
            coverageData.overall.percentage >= 50 ? 'warning' : 'error'
          }
          sx={{ height: 10, borderRadius: 1, mt: 1 }}
        />
      </Box>
      
      <Typography variant="subtitle2" gutterBottom>
        Coverage by Tactic
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {TACTIC_ORDER.filter(tactic => coverageData.byTactic[tactic]?.total > 0).map((tactic) => {
          const { total, covered, percentage } = coverageData.byTactic[tactic] || { total: 0, covered: 0, percentage: 0 };
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
    </Box>
  );
};

export default CoverageOverview;