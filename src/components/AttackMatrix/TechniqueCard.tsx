// src/components/AttackMatrix/TechniqueCard.tsx
import React from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TechniqueWithSubtechniques } from '@/types';

interface TechniqueCardProps {
  technique: TechniqueWithSubtechniques;
  expanded: boolean;
  handleToggleExpand: (techniqueId: string) => void;
  renderContent: () => React.ReactNode;
  onTechniqueSelect?: (technique: TechniqueWithSubtechniques) => void;
  isSelected?: boolean;
}

const TechniqueCard: React.FC<TechniqueCardProps> = ({
  technique,
  expanded,
  handleToggleExpand,
  onTechniqueSelect,
  renderContent,
  isSelected = false,
}) => {
  const hasSubtechniques = technique.subtechniques && technique.subtechniques.length > 0;
  
  const handleCardClick = (event: React.MouseEvent) => {
    // Only trigger selection if not clicking the expand button
    if (!event.defaultPrevented && onTechniqueSelect) {
      onTechniqueSelect(technique);
    }
  };
  
  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggleExpand(technique.externalId);
  };
  
  return (
    <Box
      onClick={handleCardClick}
      sx={{
        mb: 1,
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderRadius: 1,
        p: 1,
        cursor: onTechniqueSelect ? 'pointer' : 'default',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        boxShadow: isSelected ? 2 : 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {renderContent()}
        
        {hasSubtechniques && (
          <IconButton 
            size="small" 
            onClick={handleExpandClick}
          >
            <ExpandMoreIcon
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        )}
      </Box>
      
      {hasSubtechniques && (
        <Collapse in={expanded} timeout="auto">
          <Box sx={{ pl: 2, mt: 1 }}>
            {technique.subtechniques?.map((sub) => (
              <Box 
                key={sub.id} 
                sx={{ 
                  mb: 0.5, 
                  p: 0.5, 
                  borderRadius: 1, 
                  '&:hover': { 
                    bgcolor: 'action.hover' 
                  } 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTechniqueSelect?.(sub);
                }}
              >
                <Typography variant="body2">{sub.externalId} - {sub.name}</Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default TechniqueCard;