// src/components/Dashboard/CoveragePercentageChart.tsx
import React, { useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Technique, Rule } from '@/types';
import { TACTIC_ORDER, TACTIC_TITLE } from '@/data/tacticOrder';

interface CoveragePercentageChartProps {
  techniques: Technique[];
  rules: Rule[];
}

/**
 * A horizontal bar chart component that visualizes coverage percentages across MITRE ATT&CK tactics.
 */
const CoveragePercentageChart: React.FC<CoveragePercentageChartProps> = ({ techniques, rules }) => {
  const theme = useTheme();
  
  const chartData = useMemo(() => {
    // Create a map to track techniques by tactic
    const tacticsMap: Record<string, { total: number; covered: number; percentage: number }> = {};
    
    // Initialize with all tactics from the order
    TACTIC_ORDER.forEach(tactic => {
      tacticsMap[tactic] = { total: 0, covered: 0, percentage: 0 };
    });
    
    // Count total techniques per tactic
    techniques.forEach(tech => {
      if (!tech.tactic) return;
      
      if (!tacticsMap[tech.tactic]) {
        tacticsMap[tech.tactic] = { total: 0, covered: 0, percentage: 0 };
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
    
    // Calculate percentages
    Object.keys(tacticsMap).forEach(tactic => {
      const { total, covered } = tacticsMap[tactic];
      tacticsMap[tactic].percentage = total > 0 ? Math.round((covered / total) * 100) : 0;
    });
    
    // Convert to chart data format and sort by tactic order
    return TACTIC_ORDER
      .filter(tactic => tacticsMap[tactic].total > 0) // Only include tactics that have techniques
      .map(tactic => {
        const { total, covered, percentage } = tacticsMap[tactic];
        
        return {
          tactic: TACTIC_TITLE[tactic] || tactic,
          percentage,
          covered,
          total
        };
      })
      .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
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

  // Helper function to determine color based on percentage
  const getBarColor = (percentage: number) => {
    if (percentage >= 75) return theme.palette.success.main;
    if (percentage >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Create a custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 1.5, boxShadow: theme.shadows[3] }}>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            Coverage: {data.percentage}% ({data.covered}/{data.total})
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 2, height: 400 }}>
      <Typography variant="h6" gutterBottom align="center">
        Coverage Percentage by Tactic
      </Typography>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            tick={{ fill: theme.palette.text.secondary }}
            label={{ 
              value: 'Coverage Percentage (%)', 
              position: 'insideBottom', 
              offset: -5, 
              style: { textAnchor: 'middle', fill: theme.palette.text.secondary } 
            }}
          />
          <YAxis 
            type="category"
            dataKey="tactic" 
            tick={{ fill: theme.palette.text.primary }}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={75} stroke={theme.palette.success.main} strokeDasharray="3 3" label={{
            value: "Good (75%)",
            position: "top",
            fill: theme.palette.success.main,
            fontSize: 12
          }} />
          <ReferenceLine x={50} stroke={theme.palette.warning.main} strokeDasharray="3 3" label={{
            value: "Medium (50%)",
            position: "top",
            fill: theme.palette.warning.main,
            fontSize: 12
          }} />
          <Bar dataKey="percentage" name="Coverage">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CoveragePercentageChart;