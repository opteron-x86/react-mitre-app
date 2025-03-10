// src/components/AttackMatrix/AttackMatrixHeatmap.tsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TACTIC_TITLE } from '@/data/tacticOrder';
import { normalizeTechniqueId } from '@/utils/normalizeTechnique';
import { Technique, Rule } from '@/types';
import { useColorModeAwareUtilities } from '@/utils/colorModeUtil';

export interface AttackMatrixHeatmapProps {
  techniques: Technique[];
  rules: Rule[];
  onTechniqueSelect?: (technique: Technique) => void;
}

type TechniqueWithSubtechniques = Technique & {
  subtechniques?: TechniqueWithSubtechniques[];
};

/**
 * Returns the total number of rules for a technique,
 * including rules that match any of its subtechniques.
 */
const countRulesForTechnique = (
  tech: Technique,
  subtechniques: TechniqueWithSubtechniques[] | undefined,
  rules: Rule[],
): number => {
  // Count rules for the parent technique.
  const parentCount = rules.filter((rule) => {
    const related = Array.isArray(rule.relatedTechniques)
      ? rule.relatedTechniques
      : [rule.relatedTechniques];
    return related.some((r) => normalizeTechniqueId(r) === tech.externalId);
  }).length;
  
  // Count rules for each subtechnique.
  const subCount = subtechniques
    ? subtechniques.reduce((sum, sub) => {
        const count = rules.filter((rule) => {
          const related = Array.isArray(rule.relatedTechniques)
            ? rule.relatedTechniques
            : [rule.relatedTechniques];
          return related.some((r) => normalizeTechniqueId(r) === sub.externalId);
        }).length;
        return sum + count;
      }, 0)
    : 0;
    
  return parentCount + subCount;
};

const AttackMatrixHeatmap: React.FC<AttackMatrixHeatmapProps> = ({ 
  techniques, 
  rules,
  onTechniqueSelect 
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const theme = useTheme();
  const { getTechniqueCardBackgroundColor, isDarkMode } = useColorModeAwareUtilities();

  const handleToggleExpand = (techniqueId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpanded((prev) => ({ ...prev, [techniqueId]: !prev[techniqueId] }));
  };

  // Group techniques by tactic & nest subtechniques
  const groupedTechniques = useMemo(() => {
    const groups: Record<string, TechniqueWithSubtechniques[]> = {};
    const parentMap: Record<string, TechniqueWithSubtechniques> = {};

    // Create parent entries for techniques that are not subtechniques.
    techniques.forEach((tech) => {
      if (!tech.isSubtechnique) {
        parentMap[tech.externalId] = { ...tech, subtechniques: [] };
      }
    });

    // For each technique flagged as a subtechnique, assign it to its parent
    techniques.forEach((tech) => {
      if (tech.isSubtechnique) {
        const parentCode = tech.externalId.split('.')[0];
        if (parentMap[parentCode]) {
          parentMap[parentCode].subtechniques!.push(tech as TechniqueWithSubtechniques);
        } else {
          // If no parent is found, treat it as its own parent.
          parentMap[tech.externalId] = { ...tech, subtechniques: [] };
        }
      }
    });

    // Group all parent techniques by their tactic.
    Object.values(parentMap).forEach((parent) => {
      const tactic = parent.tactic;
      if (!groups[tactic]) {
        groups[tactic] = [];
      }
      groups[tactic].push(parent);
    });

    // Sort each group by externalId.
    Object.keys(groups).forEach((tactic) => {
      groups[tactic].sort((a, b) => a.externalId.localeCompare(b.externalId));
    });
    
    return groups;
  }, [techniques]);

  // Compute maximum rule count for scaling
  const maxRuleCount = useMemo(() => {
    let max = 0;
    Object.values(groupedTechniques).forEach((group) => {
      group.forEach((parent) => {
        const total = countRulesForTechnique(parent, parent.subtechniques, rules);
        if (total > max) {
          max = total;
        }
      });
    });
    return max;
  }, [groupedTechniques, rules]);

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2, minWidth: 'min-content' }}>
        {Object.keys(groupedTechniques).map((tactic) => (
          <Box key={tactic} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Paper 
              sx={{ 
                p: 1,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'background-color 0.3s ease'
              }}
            >
              <Typography
                variant="h6"
                align="center"
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider', 
                  mb: 1,
                  pb: 1
                }}
              >
                {TACTIC_TITLE[tactic] || tactic}
              </Typography>
              
              {groupedTechniques[tactic].map((parent) => {
                const ruleCount = countRulesForTechnique(parent, parent.subtechniques, rules);
                const bgColor = getTechniqueCardBackgroundColor(ruleCount, maxRuleCount);
                
                // Determine text color based on background and theme
                const textColor = isDarkMode 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(0, 0, 0, 0.87)';
                
                return (
                  <Box
                    key={parent.id}
                    sx={{
                      mb: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      p: 1,
                      backgroundColor: bgColor,
                      cursor: onTechniqueSelect ? 'pointer' : 'default',
                      '&:hover': onTechniqueSelect ? { 
                        filter: 'brightness(0.95)',
                        boxShadow: 1,
                        ...(isDarkMode && { 
                          filter: 'brightness(1.1)',
                        })
                      } : {},
                      color: textColor,
                      transition: 'background-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onClick={() => onTechniqueSelect?.(parent)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2">{parent.externalId} - {parent.name}</Typography>
                      {parent.subtechniques && parent.subtechniques.length > 0 && (
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleToggleExpand(parent.externalId, e)}
                          sx={{
                            color: 'inherit',
                            opacity: 0.8,
                            '&:hover': {
                              opacity: 1
                            }
                          }}
                        >
                          <ExpandMoreIcon
                            sx={{
                              transform: expanded[parent.externalId] ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s',
                            }}
                          />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {ruleCount} rule{ruleCount !== 1 ? 's' : ''}
                    </Typography>
                    
                    {parent.subtechniques && parent.subtechniques.length > 0 && (
                      <Collapse in={expanded[parent.externalId]} timeout="auto">
                        <Box sx={{ pl: 2, mt: 1 }}>
                          {parent.subtechniques.map((sub) => {
                            const subCount = countRulesForTechnique(sub, undefined, rules);
                            const subBgColor = getTechniqueCardBackgroundColor(subCount, maxRuleCount);
                            
                            return (
                              <Box
                                key={sub.id}
                                sx={{
                                  mb: 0.5,
                                  backgroundColor: subBgColor,
                                  display: 'block',
                                  padding: '2px 4px',
                                  borderRadius: '2px',
                                  cursor: onTechniqueSelect ? 'pointer' : 'default',
                                  color: textColor,
                                  '&:hover': onTechniqueSelect ? { 
                                    filter: isDarkMode ? 'brightness(1.1)' : 'brightness(0.95)',
                                    boxShadow: 1
                                  } : {},
                                  transition: 'background-color 0.2s ease'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTechniqueSelect?.(sub);
                                }}
                              >
                                <Typography variant="body2">
                                  {sub.externalId} - {sub.name} ({subCount})
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </Collapse>
                    )}
                  </Box>
                );
              })}
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AttackMatrixHeatmap;