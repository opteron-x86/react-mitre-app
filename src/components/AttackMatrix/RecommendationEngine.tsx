// src/components/AttackMatrix/RecommendationEngine.tsx
import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip,
  Divider
} from '@mui/material';
import { Technique, Rule } from '@/types';

interface RecommendationEngineProps {
  techniques: Technique[];
  rules: Rule[];
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  techniques = [],
  rules = []
}) => {
  // Ensure we're working with valid arrays
  const validTechniques = Array.isArray(techniques) ? techniques : [];
  const validRules = Array.isArray(rules) ? rules : [];

  const recommendations = useMemo(() => {
    // Create a map of technique IDs to their technique objects
    const techniqueMap = new Map<string, Technique>();
    
    validTechniques.forEach((tech) => {
      if (tech && tech.externalId) {
        techniqueMap.set(tech.externalId, tech);
      }
    });
    
    // Create a map of technique IDs to their coverage (rules)
    const coverageMap = new Map<string, Rule[]>();
    
    validRules.forEach((rule) => {
      if (!rule || !rule.relatedTechniques) return;
      
      const relatedTechniques = Array.isArray(rule.relatedTechniques)
        ? rule.relatedTechniques
        : [rule.relatedTechniques];
        
      relatedTechniques.forEach((techId) => {
        if (!techId) return;
        
        if (!coverageMap.has(techId)) {
          coverageMap.set(techId, []);
        }
        
        const rulesForTechnique = coverageMap.get(techId);
        if (rulesForTechnique) {
          rulesForTechnique.push(rule);
        }
      });
    });
    
    // Find top 5 critical techniques with no coverage
    const criticalUncovered = validTechniques
      .filter((tech) => tech && tech.externalId && !coverageMap.has(tech.externalId) && tech.isSubtechnique === false)
      .sort((a, b) => {
        // Sort by "criticality" - for this example, just use the tactic order
        const aTactic = a.tactic || '';
        const bTactic = b.tactic || '';
        return aTactic.localeCompare(bTactic);
      })
      .slice(0, 5);
      
    // Find techniques with low coverage (only 1 rule)
    const lowCoverage = Array.from(coverageMap.entries())
      .filter(([techId, techRules]) => techRules.length === 1)
      .map(([techId, techRules]) => {
        const technique = techniqueMap.get(techId);
        return {
          technique,
          rules: techRules,
        };
      })
      .filter(item => item.technique && item.technique.isSubtechnique === false)
      .slice(0, 5);
      
    return {
      criticalUncovered,
      lowCoverage,
    };
  }, [validTechniques, validRules]);
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Coverage Recommendations
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom color="error.main">
        Critical Techniques With No Coverage
      </Typography>
      {recommendations.criticalUncovered.length > 0 ? (
        <List dense>
          {recommendations.criticalUncovered.map((tech) => (
            <ListItem key={tech.id}>
              <ListItemText
                primary={`${tech.externalId} - ${tech.name}`}
                secondary={`Tactic: ${tech.tacticTitle || tech.tactic}`}
              />
              <Chip label="High Priority" color="error" size="small" />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No critical uncovered techniques found.
        </Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom color="warning.main">
        Techniques With Low Coverage (1 Rule)
      </Typography>
      {recommendations.lowCoverage.length > 0 ? (
        <List dense>
          {recommendations.lowCoverage.map(({ technique, rules }) => {
            if (!technique) return null;
            return (
              <ListItem key={technique.id}>
                <ListItemText
                  primary={`${technique.externalId} - ${technique.name}`}
                  secondary={`Current rule: ${rules[0].name}`}
                />
                <Chip label="Medium Priority" color="warning" size="small" />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No techniques with low coverage found.
        </Typography>
      )}
    </Box>
  );
};

export default RecommendationEngine;