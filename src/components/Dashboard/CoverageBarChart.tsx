// src/components/Dashboard/CoverageBarChart.tsx
import React, { useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Technique, Rule } from '@/types';
import { TACTIC_ORDER, TACTIC_TITLE } from '@/data/tacticOrder';

interface CoverageBarChartProps {
  techniques: Technique[];
  rules: Rule[];
}

/**
 * A bar chart component that visualizes coverage across MITRE ATT&CK tactics.
 * This shows both covered and uncovered techniques per tactic.
 */
const CoverageBarChart: React.FC<CoverageBarChartProps> = ({ techniques, rules }) => {
  const theme = useTheme();
  
  const chartData = useMemo(() => {
    // Create a map to track techniques by tactic
    const tacticsMap: Record<string, { total: number; covered: number; uncovered: number }> = {};
    
    // Initialize with all tactics from the order
    TACTIC_ORDER.forEach(tactic => {
      tacticsMap[tactic] = { total: 0, covered: 0, uncovered: 0 };
    });
    
    // Count total techniques per tactic
    techniques.forEach(tech => {
      if (!tech.tactic) return;
      
      if (!tacticsMap[tech.tactic]) {
        tacticsMap[tech.tactic] = { total: 0, covered: 0, uncovered: 0 };
      }
      
      tacticsMap[tech.tactic].total += 1;
    });
    
    // Find techniques with rules (covered techniques)
    const coveredTechniqueIds = new Set<string>();
    
    rules.forEach(rule => {
      if (!rule.relatedTechniques) return;
      
      const relatedTechniques = Array.isArray(rule.relatedTechniques)
        ? rule.relatedTechniques
        : [rule.relatedTechniques];
      
      relatedTechniques.forEach(techId => {
        if (techId) coveredTechniqueIds.add(techId);
      });
    });
    
    // Count covered techniques per tactic
    techniques.forEach(tech => {
      if (!tech.tactic || !tech.externalId) return;
      
      if (coveredTechniqueIds.has(tech.externalId)) {
        if (tacticsMap[tech.tactic]) {
          tacticsMap[tech.tactic].covered += 1;
        }
      }
    });
    
    // Calculate uncovered counts
    Object.keys(tacticsMap).forEach(tactic => {
      const { total, covered } = tacticsMap[tactic];
      tacticsMap[tactic].uncovered = total - covered;
    });
    
    // Convert to chart data format and sort by tactic order
    return TACTIC_ORDER
      .filter(tactic => tacticsMap[tactic].total > 0) // Only include tactics that have techniques
      .map(tactic => {
        const { total, covered, uncovered } = tacticsMap[tactic];
        const coveragePercentage = total > 0 ? Math.round((covered / total) * 100) : 0;
        
        return {
          tactic: TACTIC_TITLE[tactic] || tactic,
          covered,
          uncovered,
          total,
          coveragePercentage
        };
      });
  }, [techniques, rules]);
  
  // If no data is available, show a message
  if (!chartData.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">
          No coverage data available to display.
        </Typography>
      </Paper>
    );
  }

  // Define colors for the chart
  const coveredColor = theme.palette.success.main;
  const uncoveredColor = theme.palette.error.main;

  // Create a custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 1.5, boxShadow: theme.shadows[3] }}>
          <Typography variant="subtitle2">{label}</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ color: coveredColor }}>
              Covered: {data.covered} techniques
            </Typography>
            <Typography variant="body2" sx={{ color: uncoveredColor }}>
              Uncovered: {data.uncovered} techniques
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
              Coverage: {data.coveragePercentage}% ({data.covered}/{data.total})
            </Typography>
          </Box>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 2, height: 400 }}>
      <Typography variant="h6" gutterBottom align="center">
        Technique Coverage by Tactic
      </Typography>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          barSize={35}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="tactic" 
            tick={{ fill: theme.palette.text.primary, fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
          />
          <YAxis 
            tick={{ fill: theme.palette.text.secondary }}
            label={{ 
              value: 'Number of Techniques', 
              angle: -90, 
              position: 'insideLeft', 
              style: { textAnchor: 'middle', fill: theme.palette.text.secondary } 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36} 
            formatter={(value) => <span style={{ color: theme.palette.text.primary }}>{value}</span>}
          />
          <Bar dataKey="covered" stackId="a" name="Covered" fill={coveredColor} />
          <Bar dataKey="uncovered" stackId="a" name="Uncovered" fill={uncoveredColor} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CoverageBarChart;