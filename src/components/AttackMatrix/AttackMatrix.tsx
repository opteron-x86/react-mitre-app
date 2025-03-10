// src/components/AttackMatrix/AttackMatrix.tsx
import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Technique, Rule } from '@/types';
import { TACTIC_TITLE } from '@/data/tacticOrder';
import TacticColumn from './TacticColumn';
import { useAttackMatrixData, TechniqueWithSubtechniques } from '@/hooks/useAttackMatrixData';

export interface AttackMatrixProps {
  techniques: Technique[];
  rules: Rule[];
  onTechniqueSelect?: (technique: Technique) => void;
}

const AttackMatrix: React.FC<AttackMatrixProps> = ({ techniques, rules, onTechniqueSelect }) => {
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string | null>(null);
  
  const {
    // Data processing results
    expanded,
    groupedTechniques,
    
    // Utility functions
    handleToggleExpand,
    renderTechniqueLabel,
  } = useAttackMatrixData(techniques, rules);

  // Render technique cell content
  const renderTechniqueCell = (technique: TechniqueWithSubtechniques, isExpanded: boolean) => (
    <Box>
      <Typography variant="subtitle2">
        {renderTechniqueLabel(technique)}
      </Typography>
    </Box>
  );

  // Handle technique selection with local state tracking
  const handleTechniqueSelect = (technique: TechniqueWithSubtechniques) => {
    setSelectedTechniqueId(technique.externalId);
    if (onTechniqueSelect) {
      onTechniqueSelect(technique);
    }
  };

  // Check if any techniques match the filters
  const hasTechniques = Object.keys(groupedTechniques).length > 0;

  if (!hasTechniques) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
        No techniques match the current filters.
      </Typography>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2, minWidth: 'min-content' }}>
        {Object.keys(groupedTechniques).map((tactic) => (
          <TacticColumn
            key={tactic}
            tactic={tactic}
            techniques={groupedTechniques[tactic]}
            renderTechniqueCell={renderTechniqueCell}
            expanded={expanded}
            handleToggleExpand={handleToggleExpand}
            onTechniqueSelect={handleTechniqueSelect}
            selectedTechniqueId={selectedTechniqueId || undefined}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AttackMatrix;