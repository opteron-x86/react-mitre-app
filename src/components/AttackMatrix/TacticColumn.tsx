// src/components/AttackMatrix/TacticColumn.tsx
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { TACTIC_TITLE } from '@/data/tacticOrder';
import TechniqueCard from './TechniqueCard';
import { TechniqueWithSubtechniques } from '@/types';

interface TacticColumnProps {
  tactic: string;
  techniques: TechniqueWithSubtechniques[];
  renderTechniqueCell: (technique: TechniqueWithSubtechniques, expanded: boolean) => React.ReactNode;
  expanded: Record<string, boolean>;
  handleToggleExpand: (techniqueId: string) => void;
  onTechniqueSelect?: (technique: TechniqueWithSubtechniques) => void;
  selectedTechniqueId?: string;
}

const TacticColumn: React.FC<TacticColumnProps> = ({
  tactic,
  techniques,
  renderTechniqueCell,
  expanded,
  handleToggleExpand,
  onTechniqueSelect,
  selectedTechniqueId,
}) => {
  return (
    <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
      <Paper sx={{ p: 1 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}
        >
          {TACTIC_TITLE[tactic] || tactic}
        </Typography>
        
        {techniques.map((technique) => (
          <TechniqueCard
            key={technique.id}
            technique={technique}
            expanded={expanded[technique.externalId] || false}
            handleToggleExpand={handleToggleExpand}
            onTechniqueSelect={onTechniqueSelect}
            isSelected={selectedTechniqueId === technique.externalId}
            renderContent={() => renderTechniqueCell(technique, expanded[technique.externalId] || false)}
          />
        ))}
      </Paper>
    </Box>
  );
};

export default TacticColumn;