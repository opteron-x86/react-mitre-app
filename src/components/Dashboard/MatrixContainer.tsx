// src/components/Dashboard/MatrixContainer.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  IconButton,
  Collapse,
  Divider,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GridViewIcon from '@mui/icons-material/GridView';
import BugReportIcon from '@mui/icons-material/BugReport';
import TechniqueDetails from '@/components/AttackMatrix/TechniqueDetails';
import AttackMatrix from '@/components/AttackMatrix/AttackMatrix';
import AttackMatrixHeatmap from '@/components/AttackMatrix/AttackMatrixHeatmap';
import { Technique, Rule } from '@/types';
import { FilterState } from './GlobalFilters';
import MatrixExport from '@/components/AttackMatrix/MatrixExport';
import RuleDetailFlyout from './RuleDetailFlyout';

interface MatrixContainerProps {
  techniques: Technique[];
  rules: Rule[];
  filterState: FilterState;
  onViewRuleInExplorer?: (ruleId: string) => void;
  showFilters?: boolean;
  toggleShowFilters?: () => void;
}

const MatrixContainer: React.FC<MatrixContainerProps> = ({ 
  techniques, 
  rules, 
  filterState,
  onViewRuleInExplorer,
  showFilters = true,
  toggleShowFilters
}) => {
  // State management
  const [expanded, setExpanded] = useState(true);
  const [useHeatmap, setUseHeatmap] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [showRuleDetail, setShowRuleDetail] = useState(false);
  
  // Filter techniques and rules based on the global filter state
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
    
    // Apply rule existence filter
    if (filterState.ruleExistence) {
      // If we filter for techniques with rules, we keep all rules
      return true;
    }
    
    return true;
  });

  // Find rules related to the selected technique
  const relatedRules = selectedTechnique 
    ? filteredRules.filter((rule) => {
        const related = Array.isArray(rule.relatedTechniques)
          ? rule.relatedTechniques
          : [rule.relatedTechniques];
        return related.includes(selectedTechnique.externalId);
      })
    : [];

  // Handler for technique selection
  const handleTechniqueSelect = (technique: Technique) => {
    setSelectedTechnique(technique);
    // Clear any selected rule when selecting a new technique
    setSelectedRule(null);
    setShowRuleDetail(false);
  };

  // Handler to clear technique selection
  const handleClearSelection = () => {
    setSelectedTechnique(null);
    setSelectedRule(null);
    setShowRuleDetail(false);
  };
  
  // Handler for rule selection from technique details
  const handleRuleSelect = (rule: Rule) => {
    setSelectedRule(rule);
    setShowRuleDetail(true);
  };
  
  // Handler to close rule detail flyout
  const handleCloseRuleDetail = () => {
    setShowRuleDetail(false);
  };
  
  // Handler to view the selected rule in the rule explorer
  const handleViewRuleInExplorer = (ruleId: string) => {
    // Close the flyout
    setShowRuleDetail(false);
    
    // Call the parent handler if provided
    if (onViewRuleInExplorer) {
      onViewRuleInExplorer(ruleId);
    }
  };

  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GridViewIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            {selectedTechnique ? 'Technique Details' : 'ATT&CK Matrix'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!selectedTechnique && (
            <>
              <Button 
                variant="text" 
                size="small" 
                onClick={toggleShowFilters}
                sx={{ mr: 2 }}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={useHeatmap}
                    onChange={(e) => setUseHeatmap(e.target.checked)}
                    size="small"
                  />
                }
                label="Heatmap View"
              />
            </>
          )}
          
          {selectedTechnique && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleClearSelection}
              sx={{ mr: 2 }}
            >
              Back to Matrix
            </Button>
          )}
          
          {!selectedTechnique && (
            <MatrixExport 
              techniques={filteredTechniques} 
              rules={filteredRules} 
              sx={{ mr: 2 }}
            />
          )}
          
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
      </Box>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        
        <Box sx={{ p: 2 }}>
          {selectedTechnique ? (
            <TechniqueDetails 
              technique={selectedTechnique}
              relatedRules={relatedRules}
              onClose={handleClearSelection}
              onRuleSelect={handleRuleSelect}
            />
          ) : useHeatmap ? (
            <AttackMatrixHeatmap 
              techniques={filteredTechniques} 
              rules={filteredRules} 
              onTechniqueSelect={handleTechniqueSelect}
            />
          ) : (
            <AttackMatrix 
              techniques={filteredTechniques} 
              rules={filteredRules} 
              onTechniqueSelect={handleTechniqueSelect}
            />
          )}
        </Box>
      </Collapse>
      
      {/* Rule Detail Flyout */}
      <RuleDetailFlyout
        rule={selectedRule}
        open={showRuleDetail}
        onClose={handleCloseRuleDetail}
        onViewInExplorer={handleViewRuleInExplorer}
      />
    </Paper>
  );
};

export default MatrixContainer;