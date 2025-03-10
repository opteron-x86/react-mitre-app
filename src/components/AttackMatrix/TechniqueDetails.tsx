// src/components/AttackMatrix/TechniqueDetails.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Technique, Rule } from '@/types';

interface TechniqueDetailsProps {
  technique: Technique | null;
  relatedRules: Rule[];
  onClose: () => void;
  onRuleSelect?: (rule: Rule) => void;
}

const TechniqueDetails: React.FC<TechniqueDetailsProps> = ({
  technique,
  relatedRules,
  onClose,
  onRuleSelect,
}) => {
  if (!technique) return null;

  return (
    <Paper sx={{ p: 0, mb: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <IconButton 
          onClick={onClose} 
          size="small" 
          sx={{ mr: 1 }}
          aria-label="Back to matrix"
        >
          <KeyboardBackspaceIcon />
        </IconButton>
        <Box>
          <Typography variant="h6">
            {technique.externalId} - {technique.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {technique.tacticTitle}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {technique.description}
        </Typography>

        {technique.detection && (
          <>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Detection</Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 2 }}>
              <Typography variant="body2">{technique.detection}</Typography>
            </Paper>
          </>
        )}

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Platforms</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {technique.platforms?.map((platform) => (
            <Chip key={platform} label={platform} size="small" />
          ))}
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Data Sources</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {technique.dataSources?.map((ds) => (
            <Chip key={ds} label={ds} size="small" />
          ))}
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Related Rules ({relatedRules.length})</Typography>
        {relatedRules.length > 0 ? (
          <Paper sx={{ bgcolor: 'background.default' }}>
            <List disablePadding>
              {relatedRules.map((rule) => (
                <ListItem 
                  key={rule.id} 
                  divider
                  sx={{ 
                    cursor: onRuleSelect ? 'pointer' : 'default',
                    '&:hover': onRuleSelect ? { bgcolor: 'action.hover' } : {}
                  }}
                  onClick={() => onRuleSelect?.(rule)}
                >
                  <ListItemText
                    primary={rule.name}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                        <Chip 
                          label={rule.severity} 
                          size="small" 
                          color={
                            rule.severity.toLowerCase() === 'high' ? 'error' :
                            rule.severity.toLowerCase() === 'medium' ? 'warning' : 'success'
                          }
                        />
                        <Chip 
                          label={rule.status} 
                          size="small" 
                          variant="outlined"
                        />
                        {Array.isArray(rule.platforms) ? (
                          rule.platforms.slice(0, 2).map(platform => (
                            <Chip key={platform} label={platform} size="small" variant="outlined" />
                          ))
                        ) : (
                          <Chip label={rule.platforms} size="small" variant="outlined" />
                        )}
                        {Array.isArray(rule.platforms) && rule.platforms.length > 2 && (
                          <Chip label={`+${rule.platforms.length - 2} more`} size="small" variant="outlined" />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
            <Typography variant="body2" color="text.secondary">
              No detection rules available for this technique.
            </Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
};

export default TechniqueDetails;